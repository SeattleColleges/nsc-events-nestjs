import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsTimeConstraint implements ValidatorConstraintInterface {
  validate(time: string) {
    const timePattern = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(?:AM|PM|am|pm)$/;
    return timePattern.test(time);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} has an invalid time format. Time must be in the format HH:MM AM|PM.`;
  }
}

export function IsTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeConstraint,
    });
  };
}
