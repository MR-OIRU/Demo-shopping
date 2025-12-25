import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/common/guards';
import { ProductsItem } from './types/product';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(): Promise<ProductsItem[]> {
    return this.productService.getProducts();
  }
}
