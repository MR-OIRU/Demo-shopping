import { CartItem } from "./cart";

export interface Order {
  orderNumber: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  timestamp: string;
}
