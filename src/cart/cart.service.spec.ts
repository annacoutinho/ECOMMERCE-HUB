import { CartService } from './cart.service';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  it('deve adicionar um novo item ao carrinho', () => {
    const result = service.addToCart({ productId: '1', quantity: 2 });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ productId: '1', quantity: 2 });
  });

  it('deve somar a quantidade se o item já existir', () => {
    service.addToCart({ productId: '1', quantity: 2 });
    const result = service.addToCart({ productId: '1', quantity: 3 });
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5);
  });

  it('deve retornar os itens do carrinho', () => {
    service.addToCart({ productId: '1', quantity: 2 });
    const cart = service.getCart();
    expect(cart).toHaveLength(1);
  });

  it('deve remover um item do carrinho', () => {
    service.addToCart({ productId: '1', quantity: 2 });
    const result = service.removeFromCart('1');
    expect(result).toHaveLength(0);
  });

  it('deve lançar erro ao remover item inexistente', () => {
    expect(() => service.removeFromCart('999')).toThrow(NotFoundException);
  });
});
