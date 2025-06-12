import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddToCartDto } from '../../cart/dto/add-to-cart.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddToCartDto)
  cartItems?: AddToCartDto[];
}
