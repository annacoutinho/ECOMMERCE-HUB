import { Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';

 export interface CartItem {
  productId: string;
  quantity: number;
}

@Injectable()
export class CartService {
  private cart: CartItem[] = [];

  addToCart(item: AddToCartDto): CartItem[] {
    const existingItem = this.cart.find(ci => ci.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cart.push({ ...item });
    }
    return this.cart;
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  removeFromCart(productId: string): CartItem[] {
    const index = this.cart.findIndex(ci => ci.productId === productId);
    if (index === -1) {
      throw new NotFoundException('Produto não encontrado no carrinho');
    }
    this.cart.splice(index, 1);
    return this.cart;
  }

  clearCart() {
    this.cart = [];
  }
}
