import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaClient) {}

  async createOrder(dto: CreateOrderDto) {
    if (!dto.cartItems || dto.cartItems.length === 0) {
      throw new BadRequestException('Carrinho está vazio');
    }

    const produtos = await this.prisma.produto.findMany({
      where: {
        id: { in: dto.cartItems.map(i => i.productId) },
      },
    });

    if (produtos.length === 0) {
      throw new BadRequestException('Nenhum produto encontrado');
    }

    let total = 0;
    const itens = dto.cartItems.map(item => {
      const produto = produtos.find(p => p.id === item.productId);
      if (!produto) {
        throw new BadRequestException(`Produto ${item.productId} não encontrado`);
      }
      total += produto.price * item.quantity;
      return {
        produtoId: item.productId,
        quantidade: item.quantity,
      };
    });

    const pedido = await this.prisma.pedido.create({
      data: {
        total,
        itens: {
          create: itens,
        },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    return pedido;
  }

  async getAllOrders() {
    return this.prisma.pedido.findMany({
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }
}
