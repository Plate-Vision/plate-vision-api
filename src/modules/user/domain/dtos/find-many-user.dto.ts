import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { EUserStatus } from '../enums/user-status.enum';

export class FindManyUserDTO extends FindManyDTO {
  @ApiPropertyOptional({
    description: 'Filtro por nome e/ou e-mail do usuários',
  })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por ID do perfil do usuário',
  })
  @IsOptional()
  @IsNumberString()
  public roleId?: number;

  @ApiPropertyOptional({
    description: 'Filtro por status do usuário',
  })
  @IsOptional()
  @IsEnum(EUserStatus)
  public status?: EUserStatus;
}
