import {
  Column,
  ColumnOptions,
  PrimaryColumn,
  PrimaryColumnOptions,
} from 'typeorm';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  if (options.nullable) {
    return applyDecorators(
      Column({ ...options, comment: options.description }),
      ApiPropertyOptional({
        ...options,
        name: undefined,
        type: undefined,
        maxLength: parseInt(`${options.length}`),
      }),
    );
  }
  return applyDecorators(
    Column({ ...options, comment: options.description }),
    ApiProperty({
      ...options,
      type: undefined,
      name: undefined,
      maxLength: parseInt(`${options.length}`),
    }),
  );
}

export function PrimaryColumnEntity(
  options: Exclude<PrimaryColumnOptions, 'comment' | 'nullable'> & {
    example?: any;
    format?: string;
    description: string;
  },
) {
  return applyDecorators(
    PrimaryColumn({ ...options, comment: options.description }),
    ApiProperty({
      ...options,
      type: undefined,
      maxLength: parseInt(`${options.length}`),
    }),
  );
}
