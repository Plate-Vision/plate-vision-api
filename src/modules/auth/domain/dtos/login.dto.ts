import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ description: 'Senha' })
  @IsString()
  @IsNotEmpty()
  public password: string;
}
