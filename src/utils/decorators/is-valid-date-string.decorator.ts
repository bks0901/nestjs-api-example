import { isValidDateString } from '@utils/validators/is-valid-date-string.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDateString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDateString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isValidDateString(value);
        },
        defaultMessage() {
          return '유효한 날짜 문자열이 아닙니다 (예: YYYY-MM-DD)';
        },
      },
    });
  };
}
