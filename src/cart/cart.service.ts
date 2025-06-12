import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../../prisma/prisma.service" ; 
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  private readonly fixedCartId = 'carrinho-teste-123';

  constructor(private readonly prisma: PrismaService) {}

  async addToCart(item: AddToCartDto) {
    
    await this.ensureCartExists();

    const existingItem = await this.prisma.itemCarrinho.findFirst({
      where: {
        carrinhoId: this.fixedCartId,
        produtoId: item.productId,
      },
    });

    if (existingItem) {
      await this.prisma.itemCarrinho.update({
        where: { id: existingItem.id },
        data: {
          quantidade: existingItem.quantidade + item.quantity,
        },
      });
    } else {
      await this.prisma.itemCarrinho.create({
        data: {
          produtoId: item.productId,
          quantidade: item.quantity,
          carrinhoId: this.fixedCartId,
        },
      });
    }

    return this.getCart();
  }

  async getCart() {
    return this.prisma.itemCarrinho.findMany({
      where: { carrinhoId: this.fixedCartId },
      include: { carrinho: true },
    });
  }

  async removeFromCart(productId: string) {
    const existingItem = await this.prisma.itemCarrinho.findFirst({
      where: {
        carrinhoId: this.fixedCartId,
        produtoId: productId,
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Produto não encontrado no carrinho');
    }

    await this.prisma.itemCarrinho.delete({
      where: { id: existingItem.id },
    });

    return this.getCart();
  }

  async clearCart() {
    await this.prisma.itemCarrinho.deleteMany({
      where: { carrinhoId: this.fixedCartId },
    });
  }

  private async ensureCartExists() {
    const carrinho = await this.prisma.carrinho.findUnique({
      where: { id: this.fixedCartId },
    });

    if (!carrinho) {
      await this.prisma.carrinho.create({
        data: {
          id: this.fixedCartId,
        },
      });
    }
  }
}
