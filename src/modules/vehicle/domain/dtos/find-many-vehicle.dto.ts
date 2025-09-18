import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { EVehicleStatus } from '../enums/vehicle-status.enum';

export class FindManyVehicleDTO extends FindManyDTO {
  @ApiPropertyOptional({
    description: 'Filtro específico por placa de veículo',
  })
  @IsString()
  @IsOptional()
  public licensePlate?: string;

  @ApiPropertyOptional({
    description: 'Filtro específico por modelo do veículo',
  })
  @IsString()
  @IsOptional()
  public modelName?: string;

  @ApiPropertyOptional({
    description: 'Filtro específico por se é ou não veículo de serviço',
  })
  @IsBooleanString()
  @IsOptional()
  public isServiceVehicle?: boolean;

  @ApiPropertyOptional({
    description: 'Filtro por status de veículo',
  })
  @IsOptional()
  @IsEnum(EVehicleStatus)
  public status?: EVehicleStatus;
}
