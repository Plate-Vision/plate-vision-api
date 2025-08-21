import { ApiProperty } from '@nestjs/swagger';

export class AuthPayload {
  @ApiProperty({ description: 'Token de acesso da aplicação' })
  public token: string;

  @ApiProperty({ description: 'Token para que seja realizado o refresh token' })
  public refreshToken: string;

  @ApiProperty({
    description:
      'Indicator se usuário precisa alterar a senha antes de acessar',
  })
  public resetPassword?: boolean;
}
