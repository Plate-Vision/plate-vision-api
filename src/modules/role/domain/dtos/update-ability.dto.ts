import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAbilityDTO {
  @ApiProperty({ description: 'Nome da habilidade' })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
