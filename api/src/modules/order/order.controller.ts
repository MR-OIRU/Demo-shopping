import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/common/guards';
import { OrdersItem } from './types/order';
import { OrderDate } from './dto/date.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async getOrders(@Body() date: OrderDate): Promise<OrdersItem[]> {
    return this.orderService.getOrders(date);
  }
}
