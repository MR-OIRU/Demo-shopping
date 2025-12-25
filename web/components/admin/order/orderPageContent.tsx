"use client";

import { useOrders } from "@/hooks/use-order";
import OrderListTable from "../tables/order/orderList";

export default function OrderPageContent() {
      const { data, refetch } = useOrders();

    return (
        <div className="p-6">
            <div className="grid grid-cols-1">
                <OrderListTable data={data || []} refetch={refetch} />
            </div>
        </div>
    );
}
