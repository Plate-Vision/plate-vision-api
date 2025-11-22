import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateVehicleDTO {
  @ApiProperty({ description: 'Placa do Veículo', example: 'ABC1D23' })
  @IsString()
  @IsNotEmpty({ message: 'A placa não pode estar vazia' })
  @Length(7, 15, {
    message: `A placa de ve ter no mínimo ${7} caracteres e no máximo ${15} caracteres`,
  })
  public licensePlate: string;

  @ApiProperty({ description: 'Modelo do Veículo', example: 'Fusca' })
  @IsString()
  @Length(2, 255, {
    message: `O modelo de ve ter no mínimo ${2} caracteres e no máximo ${255} caracteres`,
  })
  @IsOptional()
  public modelName?: string | null;

  @ApiProperty({
    description: 'Descrição do Veículo',
    example: 'Veículo de cor azul, 2 portas, modelo antigo',
  })
  @IsString()
  @MinLength(5, {
    message: `A descrição de ve ter no mínimo ${5} caracteres`,
  })
  @IsOptional()
  public description?: string | null;

  @ApiProperty({
    description: 'Condição se é ou não veículo de serviço',
    example: 'Verdadeiro',
  })
  @IsBoolean()
  @IsOptional()
  public isServiceVehicle?: boolean;

  @ApiProperty({
    description: 'Cliente ao qual o veículo pertence',
  })
  @IsOptional()
  public customer?: CustomerEntity;
}
