import { ApiProperty } from '@nestjs/swagger';
import { CreateParkingRecordDTO } from './create-parking-record.dto';
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateParkingRecordDTO extends CreateParkingRecordDTO {
  @ApiProperty({
    description: 'ID da leitura do dado IA',
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  public exitReadingId?: number | null;

  @ApiProperty({
    description: 'Data de entrada do veículo',
    example: '2023-01-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'A data e hora de saída não pode estar vazia' })
  public exitTime: Date;
}
