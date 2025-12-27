import { OrderStatus } from 'src/database/entities';

export type OrdersItem = {
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
