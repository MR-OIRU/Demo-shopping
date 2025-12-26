import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MemberListItem, MemberItem } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { MemberFormSchema } from "@/schema/member.schema";

export function useMembers() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<MemberListItem[]>({
    queryKey: ["members", accessToken],
    queryFn: async () => {
      const res = await apiClient.get<MemberListItem[]>("/member", {
        token: accessToken,
      });
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: status === "authenticated" && !!accessToken,
  });
}

export function useMeDetail() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<MemberItem>({
    queryKey: ["profile", accessToken],
    queryFn: async () => {
      const res = await apiClient.get<MemberItem>("/member/profile", {
        token: accessToken,
      });
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: status === "authenticated" && !!accessToken,
  });
}

export function useMemberById(id?: string) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<MemberItem>({
    queryKey: ["member", accessToken, id],
    queryFn: async () => {
      const res = await apiClient.post<MemberItem>(
        "/member/detail",
        { id },
        {
          token: accessToken,
        }
      );
      return res;
    },
    enabled: !!id && !!accessToken,
  });
}

function buildForData(data: MemberFormSchema) {
  const formData = new FormData();

  if (data.id) formData.append("id", data.id);
  if (data.role) formData.append("role", data.role);
  if (data.username) formData.append("username", data.username);
  if (data.email) formData.append("email", data.email);
  if (data.phone) formData.append("phone", data.phone);
  if (data.password) formData.append("password", data.password);
  if (data.confirmPassword)
    formData.append("confirmPassword", data.confirmPassword);
  if (data.profile) formData.append("profile", data.profile);

  return formData;
}

export function useProfileUpdated(onSuccess?: () => void) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  return useMutation({
    mutationFn: async (data: MemberFormSchema) => {
      const formData = buildForData(data);
      await apiClient.post("/member/profile/updated", formData, {
        token: accessToken,
      });
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

export function useMemberCreatedOrUpdated(onSuccess?: () => void) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MemberFormSchema) => {
      const formData = buildForData(data);
      await apiClient.post("/member/created-updated", formData, {
        token: accessToken,
      });
    },
    onSuccess: () => {
      toast.success("อัพเดทข้อมูลสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      void onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });
}

export function useMemberStatus(onSuccess?: () => void) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiClient.post(
        "/member/status",
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

export function useDeleteMemberById(onSuccess?: () => void) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(
        "/member/deleted",
        { id },
        {
          token: accessToken,
        }
      );
    },
    onSuccess: () => {
      toast.success("ลบข้อมูลสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      void onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });
}
