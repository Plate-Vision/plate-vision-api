import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ description: 'Nome do usuário', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome de usuário não pode estar vazio' })
  @Length(2, 50, {
    message: `O nome de usuário deve conter no mínimo ${2} caracteres e no máximo ${50}`,
  })
  public name: string;

  @ApiProperty({
    description: 'Email do usuário (precisa ser único)',
    example: 'user@email.com',
  })
  @IsEmail({}, { message: 'O e-mail de usuário informado é inválido' })
  @MaxLength(256, {
    message: 'O Email do usuário pode conter no máximo 256 caracteres',
  })
  public email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'Portal@2024' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: `A senha deve conter no mínimo ${8} caracteres,
                sendo no mínimo ${1} letra(s) maiúscula(s),
                ${1} letra(s) minúscula(s), ${1}
                número(s) e ${1} caracter(es) especial(is)`,
    },
  )
  @IsNotEmpty()
  public password: string;

  @ApiProperty({ description: 'ID do perfil do usuário', example: 1 })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  public roleId: number;
}
