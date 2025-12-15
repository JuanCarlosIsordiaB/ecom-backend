import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateProductDto {

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name : string;

    image?: string;

    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
    price : number;

    description?: string;

    @IsNotEmpty({ message: 'Inventory is required' })
    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Inventory must be a number' })
    inventory : number;

    @IsNotEmpty({ message: 'Category ID is required' })
    @IsInt({ message: 'Category ID must be an integer' })
    categoryId: number;
}
