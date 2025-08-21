import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { EAbilityReference } from '../enums/ability-reference.enum';

export class CreateAbilityDTO {
  @ApiProperty({ description: 'Referencia da habilidade' })
  @IsEnum(EAbilityReference)
  @IsNotEmpty()
  public reference: EAbilityReference;

  @ApiProperty({ description: 'Nome do habilidade' })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
