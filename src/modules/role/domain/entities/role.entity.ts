import { JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';

import { UserEntity } from '@modules/user/domain/entities/user.entity';

import { ERoleReference } from '../enums/role-reference.enum';

import { RoleAbilityEntity } from './role-ability.entity';
import { EStatus } from '@shared/enums/status.enum';

@EntityTable('roles', 'Tabela para armazenar os perfis de usuário')
export class RoleEntity extends BaseEntity {
  @ColumnEntity({
    type: 'enum',
    enum: EStatus,
    default: EStatus.ACTIVE,
    example: EStatus.ACTIVE,
    description: 'Status do perfil de usuário',
  })
  public status: EStatus;

  @ColumnEntity({
    name: 'name',
    type: 'varchar',
    example: 'Usuário',
    default: 'Usuário',
    description: 'Perfis de usuário',
  })
  public name: string;

  @ColumnEntity({
    name: 'reference',
    type: 'enum',
    enum: ERoleReference,
    example: ERoleReference.USER,
    description: 'Referencia do perfil de usuário',
    default: ERoleReference.USER,
  })
  public reference: ERoleReference;

  @OneToMany(() => UserEntity, (user) => user.role)
  @JoinColumn({ name: 'id', referencedColumnName: 'role_id' })
  public users: Array<UserEntity>;

  @OneToMany(() => RoleAbilityEntity, (roleAbility) => roleAbility.role)
  @JoinColumn({ name: 'id', referencedColumnName: 'role_id' })
  public roleAbilities: Array<RoleAbilityEntity>;
}
