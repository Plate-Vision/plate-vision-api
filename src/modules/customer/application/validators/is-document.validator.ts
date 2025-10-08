import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ECustomerType } from '../../domain/enums/customer-type.enum';
import { CreateCustomerDTO } from '../../domain/dtos/create-customer.dto';

@ValidatorConstraint({ name: 'isDocument', async: false })
export class IsDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: string, args: ValidationArguments) {
    const object = args.object as CreateCustomerDTO;
    const type = object.type;

    if (!type || !document) {
      return true;
    }

    const numericDocument = document.replace(/\D/g, '');

    if (type === ECustomerType.JU) {
      return numericDocument.length === 14;
    }

    if (type === ECustomerType.FI) {
      return numericDocument.length === 11;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateCustomerDTO;
    const type = object.type;

    if (type === ECustomerType.JU) {
      return 'O CNPJ (documento) para cliente jurídico deve conter 14 dígitos.';
    }

    if (type === ECustomerType.FI) {
      return 'O CPF (documento) para cliente físico deve conter 11 dígitos.';
    }

    return 'Tipo de cliente inválido para validação do documento.';
  }
}
