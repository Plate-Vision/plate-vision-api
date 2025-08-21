import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

import { LoginProvider } from './providers/login.provider';
import { TokenProvider } from './providers/token.provider';
import { TokenRefreshProvider } from './providers/token-refresh.provider';
import { PasswordResetProvider } from './providers/password-reset.provider';
import { PasswordRecoveryProvider } from './providers/password-recovery.provider';

@Injectable()
export class AuthService {
  public login: LoginProvider;
  public token: TokenProvider;
  public tokenRefresh: TokenRefreshProvider;
  public passwordReset: PasswordResetProvider;
  public passwordRecovery: PasswordRecoveryProvider;

  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly env: EnvironmentVariablesProvider,
  ) {
    this.token = new TokenProvider(this.jwtService, this.env);

    this.tokenRefresh = new TokenRefreshProvider(
      this.userRepository,
      this.token,
    );

    this.passwordReset = new PasswordResetProvider(
      this.userRepository,
      this.token,
    );

    this.passwordRecovery = new PasswordRecoveryProvider(
      this.userRepository,
      this.token,
    );

    this.login = new LoginProvider(this.userRepository, this.token);
  }
}
