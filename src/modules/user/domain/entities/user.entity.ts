import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';

import { EUserStatus } from '../enums/user-status.enum';

@EntityTable('users', 'Tabela para armazenar os dados de usuário')
export class UserEntity extends BaseEntity {
  @ColumnEntity({
    type: 'enum',
    enum: EUserStatus,
    description: 'Status do usuário no portal',
    default: EUserStatus.ACTIVE,
    example: EUserStatus.ACTIVE,
  })
  public status: EUserStatus;

  @ColumnEntity({
    name: 'name',
    type: 'varchar',
    length: 50,
    example: 'João da Silva',
    description: 'Nome do usuário',
  })
  public name: string;

  @ColumnEntity({
    name: 'email',
    type: 'varchar',
    length: 256,
    unique: true,
    example: 'joao@email.com',
    description: 'Endereço de email do usuário',
  })
  public email: string;

  @Exclude()
  @ColumnEntity({
    name: 'password',
    type: 'varchar',
    length: 200,
    select: false,
    description: 'Senha criptografada do usuário',
  })
  public password: string;

  @ColumnEntity({
    name: 'reset_password',
    type: 'boolean',
    description:
      'Informa se o usuário precisará trocar a senha no próximo acesso',
    default: false,
  })
  public resetPassword: boolean;

  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  public role: RoleEntity;
}
