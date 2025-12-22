import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyCouponDto {
  @IsNotEmpty({ message: 'coupon_name should not be empty' })
  @IsString()
  coupon_name: string;
}
