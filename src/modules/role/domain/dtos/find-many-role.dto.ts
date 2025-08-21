import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { EStatus } from '@shared/enums/status.enum';

import { ERoleReference } from '../enums/role-reference.enum';

export class FindManyRoleDTO extends FindManyDTO {
  @ApiPropertyOptional({ description: 'Filtro por nome do perfil de usuário' })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por referencia do perfil do usuário',
  })
  @IsOptional()
  @IsEnum(ERoleReference)
  public reference?: ERoleReference;

  @ApiPropertyOptional({
    description: 'Filtro por status do perfil do usuário',
  })
  @IsOptional()
  @IsEnum(EStatus)
  public status?: EStatus;
}
