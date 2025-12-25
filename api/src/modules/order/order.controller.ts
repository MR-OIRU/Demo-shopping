import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/common/guards';
import { OrdersItem } from './types/order';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(): Promise<OrdersItem[]> {
    return this.orderService.getOrders();
  }
}
