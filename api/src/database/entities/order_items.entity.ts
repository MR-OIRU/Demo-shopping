import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Product } from './products.entity';

@Entity({ name: 'order_items' })
@Index('idx_order_items_order', ['order'])
@Index('idx_order_items_product', ['productId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId?: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: string;

  @Column({ name: 'price_total', type: 'decimal', precision: 10, scale: 2 })
  priceTotal: string;

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  productName: string;
}
