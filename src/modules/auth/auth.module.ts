import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';

import { UserModule } from '@modules/user/user.module';
import { EnvironmentVariablesModule } from '@core/enviroment-variables/enviroment-variables.module';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

import { AuthGuard } from './domain/guards/auth.guard';
import { AuthService } from './services/auth.service';
import { AuthControllers } from './controllers/auth.controller';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvironmentVariablesModule],
      inject: [EnvironmentVariablesProvider],
      useFactory: (env: EnvironmentVariablesProvider) => {
        return {
          global: true,
          secret: env.application.authToken,
        };
      },
    }),
    UserModule,
  ],
  controllers: [...AuthControllers],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, UserModule],
})
export class AuthModule {}
