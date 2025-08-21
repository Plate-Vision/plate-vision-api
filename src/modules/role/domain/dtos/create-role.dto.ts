import {
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { EStatus } from '@shared/enums/status.enum';

import { ERoleReference } from '../enums/role-reference.enum';

import { CreateRoleAbilityDTO } from './create-role-ability.dto';

export class CreateRoleDTO {
  @ApiProperty({ description: 'Status do perfil' })
  @IsEnum(EStatus)
  @IsNotEmpty()
  public status: EStatus;

  @ApiProperty({ description: 'Referencia do perfil' })
  @IsEnum(ERoleReference)
  @IsNotEmpty()
  public reference: ERoleReference;

  @ApiProperty({ description: 'Nome do perfil' })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: 'Habilidades deste perfil',
    type: CreateRoleAbilityDTO,
    isArray: true,
  })
  @Type(() => CreateRoleAbilityDTO)
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  public abilities: Array<CreateRoleAbilityDTO>;
}
