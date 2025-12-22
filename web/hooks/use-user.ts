import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserItem } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProfileFormSchema } from "@/components/admin/setting/profile/settingProfileContent";

export function useUserDetail() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<UserItem>({
    queryKey: ["user", accessToken],
    queryFn: async () => {
      const res = await apiClient.get<UserItem>("/user/detail", {
        token: accessToken,
      });
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: status === "authenticated" && !!accessToken,
  });
}

function buildForData(data: ProfileFormSchema) {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("username", data.username);
  if (data.email) formData.append("email", data.email);
  if (data.phone) formData.append("phone", data.phone);
  if (data.password) formData.append("password", data.password);
  if (data.confirmPassword)
    formData.append("confirmPassword", data.confirmPassword);
  if (data.profile) formData.append("profile", data.profile);

  return formData;
}

export function useUpdatedUser(onSuccess?: () => void) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileFormSchema) => {
      const formData = buildForData(data);
      await apiClient.post("/user/updated", formData, {
        token: accessToken,
      });
    },
    onSuccess: () => {
      toast.success("อัพเดทข้อมูลสำเร็จ");
      void queryClient.invalidateQueries({
        queryKey: ["user", accessToken],
      });
      void onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });
}
