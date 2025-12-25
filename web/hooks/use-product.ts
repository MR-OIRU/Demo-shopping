import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductListItem } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
