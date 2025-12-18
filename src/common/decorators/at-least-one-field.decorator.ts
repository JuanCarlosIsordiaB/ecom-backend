import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneField', async: false })
export class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const fields = Array.isArray(args.constraints)
      ? (args.constraints as string[])
      : [args.constraints as string];
    const object = args.object as any;

    // Verificar que al menos uno de los campos tenga un valor
    return fields.some((field: string) => {
      const fieldValue = object[field];
      return (
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ''
      );
    });
  }

  defaultMessage(args: ValidationArguments) {
    const fields = Array.isArray(args.constraints)
      ? (args.constraints as string[])
      : [args.constraints as string];
    return `At least one of the following fields must be provided: ${fields.join(', ')}`;
  }
}

export function AtLeastOneField(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [fields],
      options: validationOptions,
      validator: AtLeastOneFieldConstraint,
    });
  };
}










