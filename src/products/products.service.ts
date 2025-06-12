import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface Produto {
  id: string;
  name: string;
  [key: string]: any; 
}

@Injectable()
export class ProductsService {
  constructor(private readonly httpService: HttpService) {}

  async getAllProducts(): Promise<Produto[]> {
    const brazilianUrl = process.env.BRAZILIAN_API_URL;
    const europeanUrl = process.env.EUROPEAN_API_URL;

    if (!brazilianUrl || !europeanUrl) {
      throw new InternalServerErrorException(
        'URLs dos fornecedores não estão configuradas. Verifique o arquivo .env.',
      );
    }

    try {
      const [brazilianResponse, europeanResponse] = await Promise.all([
        firstValueFrom(this.httpService.get<Produto[]>(brazilianUrl)),
        firstValueFrom(this.httpService.get<Produto[]>(europeanUrl)),
      ]);

      const todosProdutos = [
        ...brazilianResponse.data,
        ...europeanResponse.data,
      ];

      return todosProdutos;
    } catch (error) {
      console.error('Erro ao buscar produtos dos fornecedores:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os produtos. Tente novamente mais tarde.',
      );
    }
  }

  async getProductById(id: string): Promise<Produto | null> {
    const brazilianUrl = `${process.env.BRAZILIAN_API_URL}/${id}`;
    const europeanUrl = `${process.env.EUROPEAN_API_URL}/${id}`;

    if (!process.env.BRAZILIAN_API_URL || !process.env.EUROPEAN_API_URL) {
      throw new InternalServerErrorException(
        'URLs dos fornecedores não estão configuradas. Verifique o arquivo .env.',
      );
    }

    try {
      const brazilianResponse = await firstValueFrom(this.httpService.get<Produto>(brazilianUrl));
      if (brazilianResponse.data) {
        return brazilianResponse.data;
      }
    } catch (error) {
    }

    try {
      const europeanResponse = await firstValueFrom(this.httpService.get<Produto>(europeanUrl));
      if (europeanResponse.data) {
        return europeanResponse.data;
      }
    } catch (error) {
    }

    return null;
  }
}
