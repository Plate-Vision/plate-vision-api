import { applyDecorators } from '@nestjs/common';
import { Entity, EntityOptions, Index } from 'typeorm';

export function EntityTable(
  name: string,
  description: string,
  indexes?: string[],
  options?: Exclude<EntityOptions, 'comment'>,
) {
  if (indexes && indexes.length) {
    const indexesDecorator = indexes.map((indexName) => {
      return applyDecorators(Index(indexName, { synchronize: false }));
    });
    return applyDecorators(
      Entity(name, { comment: description, ...options }),
      ...indexesDecorator,
    );
  }
  return applyDecorators(Entity(name, { comment: description, ...options }));
}
