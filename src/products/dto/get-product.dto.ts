import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';


export class GetProductQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'category_id must be a number' })
  category_id?: number;


}