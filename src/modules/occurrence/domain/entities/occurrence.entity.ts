import { ColumnEntity } from '@core/database/domain/decorators/column-entity.decorator';
import { EntityTable } from '@core/database/domain/decorators/table-entity.decorator';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { Index, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { EOccurrenceStatus } from '../enums/occurrence-status.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';

@EntityTable('occurrences', 'Tabela para armazenar os dados de ocorrências', [
  'vehicle',
  'status',
])
export class OccurrenceEntity extends BaseEntity {
  @ColumnEntity({
    type: 'enum',
    enum: EOccurrenceStatus,
    description: 'Status da ocorrência no portal',
    default: EOccurrenceStatus.ACTIVE,
    example: EOccurrenceStatus.ACTIVE,
  })
  public status: EOccurrenceStatus;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_created_id', referencedColumnName: 'id' })
  public userCreated: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_updated_id', referencedColumnName: 'id' })
  public userUpdated?: UserEntity | null;

  @ColumnEntity({
    name: 'description',
    type: 'text',
    description: 'Descrição da ocorrência',
    example: 'Carro ficou com som alto o dia inteiro',
  })
  public description: string;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.id, {})
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  @Index()
  public vehicle: VehicleEntity;

  @ColumnEntity({
    name: 'occurrence_time',
    type: 'timestamp with time zone',
    description: 'Data e hora da ocorrência',
    example: '2023-03-15 10:00:00',
  })
  public occurrenceTime: Date;

  @ColumnEntity({
    name: 'url_image',
    type: 'text',
    description: 'URL da imagem',
    example: 'www.image.com.br',
    nullable: true,
  })
  public urlImage?: string | null;

  @ColumnEntity({
    name: 'latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    description: 'Latitude da localização',
    example: '-23.550520',
    nullable: true,
  })
  public latitude?: number | null;

  @ColumnEntity({
    name: 'longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    description: 'Longitude da localização',
    example: '-46.6333080',
    nullable: true,
  })
  public longitude?: number | null;
}
