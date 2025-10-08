import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { Index } from 'typeorm';

@EntityTable(
  'plate_readings',
  'Tabela para armazenar os dados de leitura de placas da IA',
)
export class PlateReadingEntity extends BaseEntity {
  @ColumnEntity({
    name: 'license_plate',
    type: 'varchar',
    length: 15,
    description: 'Placa do veículo',
    example: 'ABC1D23',
  })
  public licensePlate: string;

  @ColumnEntity({
    name: 'processed_at',
    type: 'timestamp with time zone',
    description: 'Data e hora em que a leitura foi processada',
    example: '2023-03-15 10:00:00',
    nullable: true,
  })
  @Index()
  public processedAt?: Date;
}
