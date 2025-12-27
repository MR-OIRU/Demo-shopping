import { Injectable } from '@nestjs/common';
import { OrdersItem } from './types/order';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/database/entities';
import { OrderDate } from './dto/date.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getOrders(date: OrderDate): Promise<OrdersItem[]> {
    const { start, end } = date;

    const result = await this.orderRepository
      .createQueryBuilder('o')
      .where('o.createdAt BETWEEN :start AND :end', {
        start: new Date(start),
        end: new Date(end),
      })
      .orderBy(
        `CASE o.order_status
          WHEN 'pending_payment' THEN 1
          WHEN 'paid' THEN 2
          WHEN 'waiting_shipment' THEN 3
          WHEN 'shipped' THEN 4
          WHEN 'cancelled' THEN 5
          ELSE 99
        END`,
        'ASC',
      )
      .addOrderBy('o.createdAt', 'ASC')
      .getMany();

    if (!result) return [];

    const orders: OrdersItem[] = result.map((item) => ({
      created: item.createdAt.toISOString(),
      orderId: item.id,
      customer: item.customer,
      address: item.address,
      total: item.total,
      items: item.items.length ?? 0,
      status: item.status,
      paidAt: item.paidAt ? item.paidAt.toISOString() : '',
      shippedAt: item.shippedAt ? item.shippedAt.toISOString() : '',
      updated: item.updatedAt.toISOString(),
    }));

    return orders;
  }
}
