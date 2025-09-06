import {
  Column,
  ColumnOptions,
  PrimaryColumn,
  PrimaryColumnOptions,
} from 'typeorm';
import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';

/**
 * Definição da ligação de uma  coluna da base de dados para/com a entidade do sistema
 * @param options Opções da Entidade
 * @returns Decoradores realizando a configuração da Coluna na entidade
 */
export function ColumnEntity(
  options: Exclude<ColumnOptions, 'comment'> & {
    example?: any;
    format?: string;
    description: string;
  },
) {
  const apiOptions: ApiPropertyOptions = {
    description: options.description,
    example: options.example,
    format: options.format,
  };

  if (options.length) {
    apiOptions.maxLength = Number(options.length);
  }

  if (options.nullable) {
    return applyDecorators(
      Column({ ...options, comment: options.description }),
      ApiPropertyOptional(apiOptions),
    );
  }
  return applyDecorators(
    Column({ ...options, comment: options.description }),
    ApiProperty(apiOptions),
  );
}

export function PrimaryColumnEntity(
  options: Exclude<PrimaryColumnOptions, 'comment' | 'nullable'> & {
    example?: any;
    format?: string;
    description: string;
  },
) {
  const apiOptions: ApiPropertyOptions = {
    description: options.description,
    example: options.example,
    format: options.format,
  };

  if (options.length) {
    apiOptions.maxLength = Number(options.length);
  }

  return applyDecorators(
    PrimaryColumn({ ...options, comment: options.description }),
    ApiProperty(apiOptions),
  );
}
