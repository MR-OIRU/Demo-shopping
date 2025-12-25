import { Injectable } from '@nestjs/common';
import { OrdersItem } from './types/order';

@Injectable()
export class OrderService {
  constructor() {}

  async getOrders(): Promise<OrdersItem[]> {
    return [];
  }
}
