import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString, IsNotEmpty, Validate } from 'class-validator';
import { AtLeastOneFieldConstraint } from '../../common/decorators/at-least-one-field.decorator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Validate(AtLeastOneFieldConstraint, ['name'], {
    message: 'At least one field must be provided to update the category',
  })
  _validateAtLeastOne?: any; // Propiedad virtual para validación a nivel de clase

  
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name must not be empty, please provide a name' })
  name?: string;
}
