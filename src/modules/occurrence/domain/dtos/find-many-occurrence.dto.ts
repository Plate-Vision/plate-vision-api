import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EOccurrenceStatus } from '../enums/occurrence-status.enum';

export class FindManyOccurrenceDTO extends FindManyDTO {
  @ApiPropertyOptional({
    description: 'Filtro por descrição da ocorrência',
  })
  @IsString()
  @IsOptional()
  public search?: string;

  @ApiPropertyOptional({
    description: 'Filtro por status da ocorrência',
  })
  @IsOptional()
  @IsEnum(EOccurrenceStatus)
  public status?: EOccurrenceStatus;
}
