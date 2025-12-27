import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './orders.entity';


export enum PaymentStatus {
  PENDING = 'pending', // สร้าง QR แล้ว รอจ่าย
  SUCCEEDED = 'succeeded', // จ่ายสำเร็จ
  FAILED = 'failed', // จ่ายไม่สำเร็จ
  EXPIRED = 'expired', // QR หมดอายุ
}

export enum PaymentProvider {
  KBANK = 'kbank',
}

export enum PaymentMethod {
  QR = 'qr',
  BANK_TRANSFER = 'bank_transfer',
}

@Entity({ name: 'payments' })
@Index('idx_payments_order', ['orderId'])
@Index('idx_payments_order_created', ['orderId', 'createdAt'])
@Index('idx_payments_status', ['status'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
    default: PaymentProvider.KBANK,
  })
  provider: PaymentProvider;

  @Column({
    name: 'provider_ref',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  providerRef?: string;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ name: 'qr_payload', type: 'text', nullable: true })
  qrPayload?: string;

  @Column({
    name: 'qr_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  qrImageUrl?: string;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @Column({ name: 'raw_webhook', type: 'jsonb', nullable: true })
  rawWebhook?: any;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt?: Date;

  @Column({
    name: 'slip_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  slipImageUrl?: string;

  @Column({ name: 'manual_reviewed_by', type: 'uuid', nullable: true })
  manualReviewedBy?: string;

  @Column({
    name: 'manual_review_result',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  manualReviewResult?: 'approved' | 'rejected';

  @Column({ name: 'manual_review_note', type: 'text', nullable: true })
  manualReviewNote?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
