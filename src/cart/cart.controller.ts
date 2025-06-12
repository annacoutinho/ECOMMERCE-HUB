import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Delete(':productId')
  removeFromCart(@Param('productId') productId: string) {
    return this.cartService.removeFromCart(productId);
  }
}
