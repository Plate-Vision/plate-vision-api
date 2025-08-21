import { ApiProperty } from '@nestjs/swagger';

export class FindManyPayload<T> {
  @ApiProperty({ description: 'Total de elementos que há com esta filtragem' })
  public total: number;

  @ApiProperty({
    description: 'Total de paginas em que os  elementos foram separados',
  })
  public pages: number;

  public data: T[];
}
