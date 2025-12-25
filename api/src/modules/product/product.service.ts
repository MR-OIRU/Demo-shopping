import { Injectable } from '@nestjs/common';
import { ProductsItem } from './types/product';

@Injectable()
export class ProductService {
  constructor() {}

  async getProducts(): Promise<ProductsItem[]> {
    return [];
  }
}
