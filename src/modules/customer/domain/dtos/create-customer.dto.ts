import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ECustomerType } from '../enums/customer-type.enum';
import { IsDocument } from '@modules/customer/application/decorators/customer-document-decorator';

export class CreateCustomerDTO {
  @ApiProperty({ description: 'Nome do cliente', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente não pode estar vazio' })
  @Length(2, 255, {
    message: `O nome do cliente deve conter no mínimo ${2} caracteres e no máximo ${255}`,
  })
  public name: string;

  @ApiProperty({
    description: 'Documento do cliente',
    example: '123.456.789-00',
  })
  @IsString()
  @IsNotEmpty({ message: 'O documento do cliente não pode estar vazio' })
  @IsDocument({
    message: 'Documento inválido para o tipo de cliente informado',
  })
  public document: string;

  @ApiProperty({
    description: 'Tipo de cliente',
    example: ECustomerType.JU,
    enum: ECustomerType,
  })
  @IsNotEmpty({ message: 'O tipo de cliente não pode estar vazio' })
  @IsEnum(ECustomerType)
  public type: ECustomerType;
}
