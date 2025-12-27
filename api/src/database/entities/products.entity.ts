import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity({ name: 'products' })
@Index('idx_products_status', ['status'])
@Index('idx_products_type', ['type'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'product_image',
    type: 'varchar',
    length: 255,
  })
  image: string;

  @Column({ name: 'product_type', type: 'varchar', length: 100 })
  type: string;

  @Column({ name: 'product_name_th', type: 'varchar', length: 255 })
  nameTh: string;

  @Column({ name: 'product_description_th', type: 'text', nullable: true })
  descriptionTh: string;

  @Column({ name: 'product_name_en', type: 'varchar', length: 255 })
  nameEn: string;

  @Column({ name: 'product_description_en', type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ name: 'product_price', type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({
    name: 'product_promotion_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  pricePro: string | null;

  @Column({ name: 'product_stock_real', type: 'int', default: 0 })
  stockReal: number;

  @Column({ name: 'product_stock_reserved', type: 'int', default: 0 })
  stockReserved: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.INACTIVE,
  })
  status: ProductStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
