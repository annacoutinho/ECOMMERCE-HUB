import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaClient } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const prismaMock = {
      produto: {
        findMany: jest.fn(),
      },
      pedido: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaClient,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should throw BadRequestException if cartItems is empty', async () => {
      await expect(service.createOrder({ cartItems: [] }))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException if produto not found', async () => {
      (prisma.produto.findMany as jest.Mock).mockResolvedValueOnce([]);

      await expect(service.createOrder({
        cartItems: [{ productId: 'fake-id', quantity: 1 }],
      })).rejects.toThrow(BadRequestException);
    });

    it('should create an order successfully', async () => {
      const produtosMock = [
        { id: '1', price: 10.0 },
      ];

      (prisma.produto.findMany as jest.Mock).mockResolvedValueOnce(produtosMock);
      const pedidoMock = {
        id: 'order-id',
        total: 20,
        itens: [
          {
            id: 'item-id',
            produtoId: '1',
            quantidade: 2,
            produto: produtosMock[0],
          }
        ],
      };
      (prisma.pedido.create as jest.Mock).mockResolvedValueOnce(pedidoMock);

      const result = await service.createOrder({
        cartItems: [{ productId: '1', quantity: 2 }],
      });

      expect(result).toEqual(pedidoMock);
    });
  });
});
