import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { Index, JoinColumn, ManyToOne } from 'typeorm';
import { EParkingRecordSource } from '../enums/parking-record-source.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { PlateReadingEntity } from '@modules/plate-reading/domain/entities/plate-reading.entity';

@EntityTable(
  'parking_records',
  'Tabela para armazenar os dados de entrada e saída de veículos',
  ['entryTime', 'exitTime', 'vehicle'],
)
export class ParkingRecordEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'user_created_id', referencedColumnName: 'id' })
  public userCreated?: UserEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_updated_id', referencedColumnName: 'id' })
  public userUpdated?: UserEntity | null;

  @ColumnEntity({
    name: 'entry_time',
    type: 'timestamp',
    description: 'Data e hora em que o veículo entrou',
    example: '2023-03-15 10:00:00',
  })
  @Index()
  public entryTime: Date;

  @ColumnEntity({
    name: 'exit_time',
    type: 'timestamp',
    description: 'Data e hora em que o veículo saiu',
    example: '2023-03-15 10:00:00',
    nullable: true,
  })
  @Index()
  public exitTime?: Date | null;

  @ColumnEntity({
    name: 'entry_source',
    type: 'enum',
    enum: EParkingRecordSource,
    description: 'Fonte do veículo na entrada',
    example: EParkingRecordSource.MA,
  })
  public entrySource: EParkingRecordSource;

  @ColumnEntity({
    name: 'exit_source',
    type: 'enum',
    enum: EParkingRecordSource,
    description: 'Fonte do veículo na saída',
    example: EParkingRecordSource.MA,
    nullable: true,
  })
  public exitSource?: EParkingRecordSource | null;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.id, { nullable: false })
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  @Index()
  public vehicle: VehicleEntity;

  @ManyToOne(() => PlateReadingEntity, (plate) => plate.id, { nullable: true })
  @JoinColumn({ name: 'entry_reading_id', referencedColumnName: 'id' })
  public entryReading?: PlateReadingEntity | null;

  @ManyToOne(() => PlateReadingEntity, (plate) => plate.id, { nullable: true })
  @JoinColumn({ name: 'exit_reading_id', referencedColumnName: 'id' })
  public exitReading?: PlateReadingEntity | null;
}
