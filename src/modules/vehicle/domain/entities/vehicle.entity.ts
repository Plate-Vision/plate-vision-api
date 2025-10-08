import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { Index, JoinColumn, ManyToOne } from 'typeorm';
import { EVehicleStatus } from '../enums/vehicle-status.enum';
import { EVehicleSource } from '../enums/vehicle-source.enum';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

@EntityTable('vehicles', 'Tabela para armazenar os dados de veículos', [
  'licensePlate',
  'status',
  'modelName',
  'isServiceVehicle',
  'customer',
])
export class VehicleEntity extends BaseEntity {
  @ColumnEntity({
    type: 'enum',
    enum: EVehicleStatus,
    description: 'Status do veículo no portal',
    default: EVehicleStatus.ACTIVE,
    example: EVehicleStatus.ACTIVE,
  })
  public status: EVehicleStatus;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'user_created_id', referencedColumnName: 'id' })
  public userCreated?: UserEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_updated_id', referencedColumnName: 'id' })
  public userUpdated?: UserEntity | null;

  @ColumnEntity({
    name: 'license_plate',
    type: 'varchar',
    length: 15,
    description: 'Placa do Veículo',
    example: 'ABC1D23',
  })
  @Index()
  public licensePlate: string;

  @ColumnEntity({
    name: 'model_name',
    type: 'varchar',
    length: 255,
    description: 'Nome do modelo do veículo',
    example: 'Fusca',
    nullable: true,
  })
  @Index()
  public modelName?: string | null;

  @ColumnEntity({
    type: 'text',
    description: 'Descrição do veículo',
    example: 'Veículo de cor azul, 2 portas, modelo antigo',
    nullable: true,
  })
  public description?: string | null;

  @ColumnEntity({
    type: 'enum',
    enum: EVehicleSource,
    description: 'Fonte do veículo no portal',
    example: EVehicleSource.MA,
  })
  public source: EVehicleSource;

  @ColumnEntity({
    name: 'is_service_vehicle',
    type: 'boolean',
    description: 'Condição se é ou não veículo de serviço',
    default: false,
  })
  @Index()
  public isServiceVehicle: boolean;

  @ManyToOne(() => CustomerEntity, (customer) => customer.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  @Index()
  public customer?: CustomerEntity | null;
}
