import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetDTO {
  @ApiProperty({ description: 'Token de recuperação' })
  @IsString()
  public token: string;

  @ApiProperty({ description: 'Nova senha' })
  @IsNotEmpty()
  @IsString()
  public password: string;
}
