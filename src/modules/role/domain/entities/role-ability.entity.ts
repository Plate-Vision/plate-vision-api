import { JoinColumn, ManyToOne } from 'typeorm';

import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';

import { AbilityEntity } from './ability.entity';
import { RoleEntity } from './role.entity';

@EntityTable(
  'role_abilities',
  'Tabela para armazenar as permissões por perfil de usuário e habilidade',
)
export class RoleAbilityEntity extends BaseEntity {
  @ManyToOne(() => AbilityEntity, (ability) => ability.roleAbilities)
  @JoinColumn({ name: 'ability_id', referencedColumnName: 'id' })
  public ability: AbilityEntity;

  @ManyToOne(() => RoleEntity, (role) => role.roleAbilities)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  public role: RoleEntity;

  @ColumnEntity({
    name: 'can_read',
    type: 'boolean',
    default: true,
    example: true,
    description: 'Permissão de leitura dentro daquela habilidade',
  })
  public canRead: boolean;

  @ColumnEntity({
    name: 'can_create',
    type: 'boolean',
    default: true,
    example: true,
    description: 'Permissão de criação dentro daquela habilidade',
  })
  public canCreate: boolean;

  @ColumnEntity({
    name: 'can_update',
    type: 'boolean',
    default: true,
    example: true,
    description: 'Permissão de atualização dentro daquela habilidade',
  })
  public canUpdate: boolean;

  @ColumnEntity({
    name: 'can_delete',
    type: 'boolean',
    default: true,
    example: true,
    description: 'Permissão de exclusão dentro daquela habilidade',
  })
  public canDelete: boolean;
}
