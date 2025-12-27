import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { OrderListItem } from "@/types";
import { useSession } from "next-auth/react";

export function useOrders(start: string, end: string, enabled: boolean) {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string;

  return useQuery<OrderListItem[]>({
    queryKey: ["orders", accessToken, start, end],
    queryFn: async () => {
      const res = await apiClient.post<OrderListItem[]>(
        "/order",
        { start, end },
        {
          token: accessToken,
        }
      );
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled:
      enabled &&
      status === "authenticated" &&
      !!accessToken &&
      !!start &&
      !!end,
  });
}
