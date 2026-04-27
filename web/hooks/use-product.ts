import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductItem, ProductListItem } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProductFormValues } from "@/schema/product.schema";

function buildForData(data: ProductFormValues) {
  const formData = new FormData();

  if (data.id) formData.append("id", data.id);
  formData.append("type", data.type);
  formData.append("url", data.url);
  formData.append("price", String(data.price));

  formData.append("nameTh", data.nameTh);
  formData.append("headingTh", data.headingTh);
  formData.append("altTextTh", data.altTextTh);
  formData.append("titleSummaryTh", data.titleSummaryTh);
  formData.append("metaTitleTh", data.metaTitleTh);
  formData.append("metaKeywordTh", data.metaKeywordTh);
  formData.append("metaDescriptionTh", data.metaDescriptionTh);
  if (data.descriptionTh) formData.append("descriptionTh", data.descriptionTh);
  formData.append("nameEn", data.nameEn);
  formData.append("headingEn", data.headingEn);
  formData.append("altTextEn", data.altTextEn);
  formData.append("titleSummaryEn", data.titleSummaryEn);
  formData.append("metaTitleEn", data.metaTitleEn);
  formData.append("metaKeywordEn", data.metaKeywordEn);
  formData.append("metaDescriptionEn", data.metaDescriptionEn);
  if (data.descriptionEn) formData.append("descriptionEn", data.descriptionEn);

  (data.images ?? []).forEach((file) => {
    formData.append("images[]", file);
  });

  return formData;
}

export function useProducts() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<ProductListItem[]>({
    queryKey: ["products", accessToken],
    queryFn: async () => {
      const res = await apiClient.get<ProductListItem[]>("/product", {
        token: accessToken,
      });
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: status === "authenticated" && !!accessToken,
  });
}

export function useProductById(id?: string, enabled = true) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<ProductItem>({
    queryKey: ["product", accessToken, id],
    queryFn: async () => {
      const res = await apiClient.post<ProductItem>(
        "/product/detail",
        { id },
        {
          token: accessToken,
        }
      );
      return res;
    },
    enabled: !!accessToken && !!id && enabled,
  });
}

export function useProductCreatedOrUpdated(onSuccess?: () => void) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const formData = buildForData(data);
      await apiClient.post("/product/created-updated", formData, {
        token: accessToken,
      });
    },
    onSuccess: () => {
      toast.success("อัพเดทข้อมูลสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      void onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });
}

export function useProductStatus(onSuccess?: () => void) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiClient.post(
        "/product/status",
        { id, status },
        {
          token: accessToken,
        }
      );
    },
    onSuccess: () => {
      toast.success("อัพเดทข้อมูลสำเร็จ");
      void onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });
}
