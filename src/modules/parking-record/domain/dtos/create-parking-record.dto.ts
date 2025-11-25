import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateParkingRecordDTO {
  @ApiProperty({
    description: 'Veículo associado ao registro de estacionamento',
    type: VehicleEntity,
  })
  public vehicle?: VehicleEntity;

  @ApiProperty({
    description: 'ID da leitura do dado IA',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  public entryReadingId?: number | null;

  @ApiProperty({
    description: 'Data de entrada do veículo',
    example: '2023-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'A data e hora de entrada não pode estar vazia' })
  public entryTime: Date;

  @ApiProperty({
    description: 'ID da leitura do dado IA',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  public exitReadingId?: number | null;

  @ApiProperty({
    description: 'Data de entrada do veículo',
    example: '2023-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  public exitTime?: Date | null;
}
