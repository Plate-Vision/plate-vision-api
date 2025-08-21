import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FindManyDTO } from '@shared/dtos/find-many.dto';

import { EAbilityReference } from '../enums/ability-reference.enum';

export class FindManyAbilityDTO extends FindManyDTO {
  @ApiPropertyOptional({ description: 'Filtro por nome do habilidade' })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({ description: 'Filtro por referencia de habilidade' })
  @IsOptional()
  @IsEnum(EAbilityReference)
  public reference?: EAbilityReference;
}
