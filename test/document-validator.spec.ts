import 'reflect-metadata';
import { describe, expect, it } from '@jest/globals';
import { ValidationArguments } from 'class-validator';
import { IsDocumentConstraint } from '@modules/customer/application/validators/is-document.validator';
import { ECustomerType } from '@modules/customer/domain/enums/customer-type.enum';

const args = (type?: ECustomerType | string) =>
  ({ object: { type } }) as ValidationArguments;

describe('Customer document validator', () => {
  const validator = new IsDocumentConstraint();

  it.each([
    [ECustomerType.FI, '123.456.789-01', true],
    [ECustomerType.FI, '123', false],
    [ECustomerType.JU, '12.345.678/0001-90', true],
    [ECustomerType.JU, '123', false],
    ['unknown', '123', false],
    [undefined, '123', true],
    [ECustomerType.FI, '', true],
  ])('validates type %s and document %s as %p', (type, document, valid) => {
    expect(validator.validate(document, args(type))).toBe(valid);
  });

  it.each([
    [
      ECustomerType.FI,
      'O CPF (documento) para cliente físico deve conter 11 dígitos.',
    ],
    [
      ECustomerType.JU,
      'O CNPJ (documento) para cliente jurídico deve conter 14 dígitos.',
    ],
    ['unknown', 'Tipo de cliente inválido para validação do documento.'],
  ])('explains a rejected document for %s', (type, message) => {
    expect(validator.defaultMessage(args(type))).toBe(message);
  });
});
