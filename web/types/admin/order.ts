export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "waiting_shipment"
  | "shipped"
  | "cancelled";

export type OrderTabValue = "all" | OrderStatus;

export type OrderListItem = {
  orderId: string;
  status: OrderStatus;
  customer: string;
  address: string;
  items: number;
  total: string;
  paidAt: string;
  shippedAt: string;
  created: string;
  updated: string;
};
