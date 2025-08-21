import { ApiProperty } from '@nestjs/swagger';

export class TokenPayload {
  @ApiProperty({ description: 'Identificador do usuário' })
  public id: number;

  @ApiProperty({ description: 'E-mail do usuário' })
  public email: string;
}
