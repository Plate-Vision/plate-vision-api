import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export abstract class FindManyDTO {
  @ApiPropertyOptional({
    description: 'Quantidade de elementos que virão na listagem',
  })
  @IsOptional()
  @IsNumberString()
  public take?: number;

  @ApiPropertyOptional({ description: 'Página dos elementos da paginação' })
  @IsOptional()
  @IsNumberString()
  public skip?: number;

  @ApiPropertyOptional({ description: 'Chave do elemento por qual ordenar' })
  @IsString()
  @IsOptional()
  public orderBy?: string;

  @ApiPropertyOptional({ description: 'Sentido da ordenação' })
  @IsString()
  @IsOptional()
  public ordering?: string;
}
