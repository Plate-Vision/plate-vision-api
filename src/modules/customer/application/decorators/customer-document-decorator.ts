import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsDocumentConstraint } from '../validators/is-document.validator';

export function IsDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDocumentConstraint,
    });
  };
}
