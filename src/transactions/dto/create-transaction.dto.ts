import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
  ValidateIf,
} from 'class-validator';

export class TransactionContentsDto {
  @IsNotEmpty({ message: 'El ID del producto no puede estar vacío' })
  @IsString({ message: 'Producto no válido' })
  productId: string;

  @IsNotEmpty({ message: 'Cantidad no puede estar vacía' })
  @IsInt({ message: 'Cantidad no válida' }) // Validate quantity too
  quantity: number;

  @IsNotEmpty({ message: 'Precio no puede estar vacío' })
  @IsNumber({}, { message: 'Precio no válido' })
  price: number;
}

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'El Total no puede ir vacio' })
  @IsNumber({}, { message: 'Cantidad no válida' })
  total: number;

  @IsOptional()
  @IsString({ message: 'El cupón debe ser una cadena de texto' })
  @ValidateIf((o) => o.coupon && o.coupon.length > 0)
  @Length(1, 100, { message: 'El cupón debe tener entre 1 y 100 caracteres' })
  coupon?: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Los Contenidos no pueden ir vacios' })
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[];
}
