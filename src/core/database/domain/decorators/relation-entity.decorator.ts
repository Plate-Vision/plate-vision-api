import {
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  ObjectType,
  OneToMany,
  RelationOptions,
} from 'typeorm';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '../entities/base.entity';

interface IManyToMany<T extends BaseEntity> {
  description: string;
  entityRelation: ObjectType<T>;
  join: { tableName: string; columnName: string; relationColumnName: string };
  relationOptions?: RelationOptions;
}

interface IOneToMany<T extends BaseEntity> {
  description: string;
  entityRelation: ObjectType<T>;
  columnName: string;
}

interface IManyToOne<T extends BaseEntity> {
  description: string;
  entityRelation: ObjectType<T>;
  relationColumnName: keyof T;
  options?: RelationOptions;
}

export function ManyToManyTest<T>({
  description,
  entityRelation,
  join,
  relationOptions,
}: IManyToMany<T>) {
  return applyDecorators(
    ApiProperty({
      description: description,
      isArray: true,
      type: entityRelation,
    }),
    ManyToMany(() => entityRelation, relationOptions),
    JoinTable({
      name: join.tableName,
      joinColumns: [{ name: join.columnName }],
      inverseJoinColumns: [{ name: join.relationColumnName }],
    }),
  );
}

/**
 * Definição de relações nas entidades para ligação de FKS
 */
export class RelationsEntity {
  /**
   * Relação Muitos para muitos, nesta relação é criado uma tabela para realizar a relação da forma devida
   * @param options Opções para a configuração desta entidade
   * @returns Decoradores configurando esta relação na entidade
   */
  public static manyToMany<T>({
    description,
    entityRelation,
    join,
    relationOptions,
  }: IManyToMany<T>) {
    return applyDecorators(
      ApiProperty({
        description: description,
        isArray: true,
        type: entityRelation,
      }),
      ManyToMany(() => entityRelation, relationOptions),
      JoinTable({
        name: join.tableName,
        joinColumns: [{ name: join.columnName }],
        inverseJoinColumns: [{ name: join.relationColumnName }],
      }),
    );
  }

  /**
   * Relação Um para Muitos, será criado uma nova coluna na respectiva tabela para que seja feita de  forma  correta a relação
   * @param options Opções para a configuração desta entidade
   * @returns Decoradores configurando esta relação na entidade
   */
  public static oneToMany<T>({
    description,
    entityRelation,
    columnName,
  }: IOneToMany<T>) {
    return applyDecorators(
      ApiProperty({ description: description, type: entityRelation }),
      ManyToOne(() => entityRelation),
      JoinColumn({ name: columnName, referencedColumnName: 'id' }),
    );
  }

  /**
   * Relação Muitos para um, será conectado com a relação em outra entidade
   * @param options Opções para a configuração desta conexão
   * @returns Decoradores configurando esta relação na entidade
   */
  public static manyToOne<T>({
    description,
    entityRelation,
    relationColumnName,
  }: IManyToOne<T>) {
    return applyDecorators(
      ApiProperty({
        description: description,
        isArray: true,
        type: entityRelation,
        required: false,
      }),
      OneToMany(
        () => entityRelation,
        (entityData) => entityData[relationColumnName],
        {
          cascade: true,
        },
      ),
    );
  }
}
