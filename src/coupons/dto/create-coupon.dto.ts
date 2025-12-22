import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";




export class CreateCouponDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt({message: 'Percentage must be an integer value'})
    @Max(100, {message: 'Percentage cannot be more than 100'})
    @Min(1, {message: 'Percentage cannot be less than 1'})
    percentage: number;

    @IsNotEmpty()
    @IsDateString({}, {message: 'Expiration date must be a valid date string'})
    expirationDate: Date;


}
