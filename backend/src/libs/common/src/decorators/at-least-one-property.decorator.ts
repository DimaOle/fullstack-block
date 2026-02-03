import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneProperty', async: false })
export class AtLeastOnePropertyConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    console.log(args);
    const object = args.object;
    return Object.keys(object).some((key) => object[key] !== undefined && object[key] !== null);
  }

  defaultMessage() {
    return 'Must be 1 of the params';
  }
}

export function AtLeastOneProperty(validationOptions?: ValidationOptions) {
  return function (object: Function) {
    registerDecorator({
      target: object,
      propertyName: 'atLeastOneProperty', // техническое имя
      options: validationOptions,
      constraints: [],
      validator: AtLeastOnePropertyConstraint,
    });
  };
}
