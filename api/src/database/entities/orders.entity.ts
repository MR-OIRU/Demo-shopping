import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order_items.entity';

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment', // รอชำระ
  PAID = 'paid', // จ่ายแล้ว
  WAITING_SHIPMENT = 'waiting_shipment', // รอจัดส่ง
  SHIPPED = 'shipped', // ส่งแล้ว
  CANCELLED = 'cancelled', // ยกเลิก/หมดอายุ/แอดมินยกเลิก
}

@Entity({ name: 'orders' })
@Index('idx_orders_status', ['status'])
@Index('idx_orders_status_expires', ['status', 'expiresAt'])
@Index('idx_orders_status_paid_at', ['status', 'paidAt'])
@Index('idx_orders_customer', ['customerId'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId?: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 255 })
  customer: string;

  @Column({ name: 'order_address', type: 'varchar', length: 255 })
  address: string;

  @Column({ name: 'order_code', type: 'varchar', length: 255, nullable: true })
  code: string;

  @Column({ name: 'order_total', type: 'decimal', precision: 10, scale: 2 })
  total: string;

  @Column({
    name: 'order_status',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @Column({ name: 'shipped_at', type: 'timestamptz', nullable: true })
  shippedAt?: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt?: Date;

  @Column({
    name: 'cancel_reason',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cancelReason?: 'expired' | 'manual';

  @Column({
    name: 'cancel_by',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cancel_by?: 'system' | 'admin';

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
