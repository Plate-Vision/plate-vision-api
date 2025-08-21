import { JoinColumn, OneToMany } from 'typeorm';

import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';

import { EAbilityReference } from '../enums/ability-reference.enum';

import { RoleAbilityEntity } from './role-ability.entity';

@EntityTable('abilities', 'Tabela para armazenar as habilidades')
export class AbilityEntity extends BaseEntity {
  @ColumnEntity({
    name: 'name',
    type: 'varchar',
    example: 'Usuários',
    description: 'Habilidades dentro do sistema',
  })
  public name: string;

  @ColumnEntity({
    name: 'reference',
    type: 'enum',
    enum: EAbilityReference,
    example: EAbilityReference.USER,
    description: 'Referencia da habilidade',
  })
  public reference: EAbilityReference;

  @OneToMany(() => RoleAbilityEntity, (roleAbility) => roleAbility.ability)
  @JoinColumn({ name: 'id', referencedColumnName: 'ability_id' })
  public roleAbilities?: Array<RoleAbilityEntity>;
}
