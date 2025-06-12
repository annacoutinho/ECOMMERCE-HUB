import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService, Produto } from './products.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpService: HttpService;

  const mockBrazilianProducts: Produto[] = [
    { id: '1', name: 'Produto BR 1' },
  ];
  const mockEuropeanProducts: Produto[] = [
    { id: '2', name: 'Produto EU 1' },
  ];

  const mockBrazilianResponse: AxiosResponse<Produto[]> = {
    data: mockBrazilianProducts,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any, 
  };

  const mockEuropeanResponse: AxiosResponse<Produto[]> = {
    data: mockEuropeanProducts,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getAllProducts', () => {
    it('deve retornar a lista unificada de produtos', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(mockBrazilianResponse))
        .mockImplementationOnce(() => of(mockEuropeanResponse));

      process.env.BRAZILIAN_API_URL = 'fake-br-url';
      process.env.EUROPEAN_API_URL = 'fake-eu-url';

      const produtos = await service.getAllProducts();

      expect(produtos).toHaveLength(2);
      expect(produtos).toEqual([...mockBrazilianProducts, ...mockEuropeanProducts]);
    });

    it('deve lançar erro se as URLs não estiverem configuradas', async () => {
      process.env.BRAZILIAN_API_URL = '';
      process.env.EUROPEAN_API_URL = '';

      await expect(service.getAllProducts()).rejects.toThrow(
        'URLs dos fornecedores não estão configuradas',
      );
    });

    it('deve lançar erro se a requisição HTTP falhar', async () => {
      process.env.BRAZILIAN_API_URL = 'fake-br-url';
      process.env.EUROPEAN_API_URL = 'fake-eu-url';

      jest.spyOn(httpService, 'get').mockImplementation(() => throwError(() => new Error('Erro HTTP')));

      await expect(service.getAllProducts()).rejects.toThrow(
        'Ocorreu um erro ao buscar os produtos',
      );
    });
  });
});
