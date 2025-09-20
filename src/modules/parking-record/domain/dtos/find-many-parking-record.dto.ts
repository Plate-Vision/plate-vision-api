import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindManyDTO } from '@shared/dtos/find-many.dto';
import {
  IsBooleanString,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EParkingRecordSource } from '../enums/parking-record-source.enum';
import { Type } from 'class-transformer';

export class FindManyParkingRecordDTO extends FindManyDTO {
  @ApiPropertyOptional({
    description: 'Filtro específico por ID do veículo',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public vehicleId?: number;

  @ApiPropertyOptional({
    description: 'Filtro por data de entrada do veículo',
    example: '2023-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  public entryTime?: Date;

  @ApiPropertyOptional({
    description: 'Filtro por data de saída do veículo',
    example: '2023-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  public exitTime?: Date;

  @ApiPropertyOptional({
    description: 'Filtro por fonte de entrada do registro',
  })
  @IsOptional()
  @IsEnum(EParkingRecordSource)
  public entrySource?: EParkingRecordSource;

  @ApiPropertyOptional({
    description: 'Filtro por fonte de saída do registro',
  })
  @IsOptional()
  @IsEnum(EParkingRecordSource)
  public exitSource?: EParkingRecordSource;
}
