import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { OrderListItem } from "@/types";
import { useSession } from "next-auth/react";

export function useOrders() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<OrderListItem[]>({
    queryKey: ["orders", accessToken],
    queryFn: async () => {
      const res = await apiClient.get<OrderListItem[]>("/order", {
        token: accessToken,
      });
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: status === "authenticated" && !!accessToken,
  });
}
