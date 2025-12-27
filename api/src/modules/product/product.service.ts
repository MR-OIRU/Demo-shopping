import { Injectable } from '@nestjs/common';
import { ProductsItem } from './types/product';
import { Product } from 'src/database/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(): Promise<ProductsItem[]> {
    const result = await this.productRepository.find({
      order: {
        type: 'ASC',
        stockReal: 'ASC',
        stockReserved: 'ASC',
        createdAt: 'ASC',
      },
    });

    if (!result) return [];

    const products: ProductsItem[] = result.map((item) => ({
      id: item.id,
      type: item.type,
      image: item.image,
      nameTh: item.nameTh,
      nameEn: item.nameEn,
      price: Number(item.price) ?? 0,
      stockReal: item.stockReal ?? 0,
      stockReserved: item.stockReserved ?? 0,
      status: item.status,
      created: item.createdAt.toISOString(),
      updated: item.updatedAt.toISOString(),
    }));
    return products;
  }
}
