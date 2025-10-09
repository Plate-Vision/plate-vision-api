import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOccurrenceDTO {
  @ApiProperty({
    description: 'Descrição da Ocorrência',
    example: 'Carro ficou com som alto o dia inteiro',
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição não pode estar vazia' })
  public description: string;

  @ApiProperty({
    description: 'Data da ocorrência',
    example: '2023-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'A data e hora da ocorrência não pode estar vazia' })
  public occurrenceTime: Date;

  @ApiProperty({
    description: 'ID do veículo vinculado à ocorrência',
    example: 5,
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'O ID do veículo não pode estar vazia' })
  @IsNumber()
  public vehicleId: number;

  @ApiProperty({
    description: 'Latitude da localização',
    example: '-23.550520',
  })
  @IsNumber(
    { maxDecimalPlaces: 8 },
    { message: 'A latitude deve ter no máximo 8 casas decimais.' },
  )
  @IsOptional()
  public latitude?: number | null;

  @ApiProperty({
    description: 'Longitude da localização',
    example: '-46.6333080',
  })
  @IsNumber(
    { maxDecimalPlaces: 8 },
    { message: 'A longitude deve ter no máximo 8 casas decimais.' },
  )
  @IsOptional()
  public longitude?: number | null;
}
