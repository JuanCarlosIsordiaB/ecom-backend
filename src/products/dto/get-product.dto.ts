import { IsNumber, IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class GetProductQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'category_id must be a number' })
  category_id: number;

  @IsOptional()
  @IsNumberString({}, { message: 'limit must be a number' })
  limit: number;


  @IsOptional()
  @IsNumberString({}, { message: 'skip must be a number' })
  skip: number;
}


export class GetOneProductDto {
  @IsUUID(undefined, { message: 'id must be a UUID' })
  id: string;
}