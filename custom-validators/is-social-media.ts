import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSocialMedia(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsSocialMedia',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'object') return false;
          if (Object.keys(value).length == 0) {
            return false;
          }
          for (const key in value) {
            if (typeof key !== 'string' || typeof value[key] !== 'string') {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an object with string keys and string values.`;
        },
      },
    });
  };
}
