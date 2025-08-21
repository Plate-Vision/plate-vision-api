/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
/**
 * Validação do Objeto antes da implementação dele na camada de Controlador
 */
export class ValidatorPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    
    if (object) {
      const errors = await validate(object, { forbidUnknownValues: false });
      if (errors.length > 0) {
        throw new HttpException(
          {
            errors,
          },
          409,
        );
      }
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
