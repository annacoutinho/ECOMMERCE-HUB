import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductsService, Produto } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Produto[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Produto> {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }
}
