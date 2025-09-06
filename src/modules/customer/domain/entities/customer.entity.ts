import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { Index, JoinColumn, ManyToOne } from 'typeorm';
import { ECustomerStatus } from '../enums/customer-status.enum';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

@EntityTable('customers', 'Tabela para armazenar os dados de clientes', [
  'name',
  'status',
  'document',
])
export class CustomerEntity extends BaseEntity {
  @ColumnEntity({
    type: 'enum',
    enum: ECustomerStatus,
    description: 'Status do cliente no portal',
    default: ECustomerStatus.ACTIVE,
    example: ECustomerStatus.ACTIVE,
  })
  @Index()
  public status: ECustomerStatus;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_created_id', referencedColumnName: 'id' })
  public userCreated: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_updated_id', referencedColumnName: 'id' })
  public userUpdated?: UserEntity | null;

  @ColumnEntity({
    type: 'varchar',
    length: 255,
    description: 'Nome do cliente',
    example: 'João da Silva',
  })
  @Index()
  public name: string;

  @ColumnEntity({
    type: 'varchar',
    length: 14,
    description: 'Documento do cliente (CPF ou CNPJ)',
    example: '123.456.789-00',
  })
  @Index()
  public document: string;
}
