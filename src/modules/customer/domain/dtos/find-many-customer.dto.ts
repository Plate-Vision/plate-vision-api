import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ECustomerStatus } from '../enums/customer-status.enum';
import { ECustomerType } from '../enums/customer-type.enum';

export class FindManyCustomerDTO extends FindManyDTO {
  @ApiPropertyOptional({
    description: 'Filtro por nome e/ou documento dos clientes',
  })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por status do cliente',
  })
  @IsOptional()
  @IsEnum(ECustomerStatus)
  public status?: ECustomerStatus;

  @ApiPropertyOptional({
    description: 'Filtro por tipo de cliente',
  })
  @IsOptional()
  @IsEnum(ECustomerType)
  public type?: ECustomerType;
}
