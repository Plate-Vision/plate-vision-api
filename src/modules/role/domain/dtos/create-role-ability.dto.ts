import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, Matches } from 'class-validator';

import { EAbilityReference } from '../enums/ability-reference.enum';

export class CreateRoleAbilityDTO {
  @ApiProperty({ description: 'Referencia da habilidade' })
  @Matches(
    `^${Object.values(EAbilityReference)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  @IsNotEmpty()
  public reference: EAbilityReference;

  @ApiProperty({
    description: 'Permissão de leitura dentro daquela habilidade',
  })
  @IsBoolean()
  public canRead: boolean;

  @ApiProperty({
    description: 'Permissão de criação dentro daquela habilidade',
  })
  @IsBoolean()
  public canCreate: boolean;

  @ApiProperty({
    description: 'Permissão de atualização dentro daquela habilidade',
  })
  @IsBoolean()
  public canUpdate: boolean;

  @ApiProperty({
    description: 'Permissão de exclusão dentro daquela habilidade',
  })
  @IsBoolean()
  public canDelete: boolean;
}
