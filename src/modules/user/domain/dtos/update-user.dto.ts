import { IsOptional, IsStrongPassword, ValidateIf } from 'class-validator';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends OmitType(CreateUserDTO, ['password']) {
  @ApiPropertyOptional({
    description: 'user password',
    example: 'Portal@2024',
  })
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
  @ValidateIf((_object, value) => Boolean(value))
  @IsOptional()
  public password?: string;
}
