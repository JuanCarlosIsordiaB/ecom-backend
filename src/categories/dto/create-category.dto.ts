import { IsNotEmpty, IsString } from 'class-validator';


export class CreateCategoryDto {
    @IsString({message: 'The name must be a string'})
    @IsNotEmpty({message: 'The name must not be empty, please provide a name'})
    name: string;

}
