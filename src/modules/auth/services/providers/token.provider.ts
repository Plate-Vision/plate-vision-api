import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

import { AuthPayload } from '@modules/auth/domain/payloads/auth.payload';
import { TokenPayload } from '@modules/auth/domain/payloads/token.payload';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

export class TokenProvider {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly env: EnvironmentVariablesProvider,
  ) {}

  public async execute(
    payload: TokenPayload,
  ): Promise<Omit<AuthPayload, 'resetPassword'>> {
    return {
      token: await this.sign(payload),
      refreshToken: await this.signRefresh(payload),
    };
  }

  public async verify(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new HttpException('Token inválido', 403);
    }
  }

  private async sign(payload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.env.application.authToken,
      expiresIn: '2h',
    });
  }

  private async signRefresh(payload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.env.application.authToken,
      expiresIn: '7d',
    });
  }
}
