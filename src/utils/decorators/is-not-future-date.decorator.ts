import { isNotFutureDate } from '@utils/validators/is-not-future-date.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNotFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isNotFutureDate(value);
        },
        defaultMessage() {
          return '오늘 이후의 날짜는 입력할 수 없습니다.';
        },
      },
    });
  };
}
