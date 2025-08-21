import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { EnvironmentVariablesProvider } from './providers/enviroment-variables.provider';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [EnvironmentVariablesProvider],
  exports: [EnvironmentVariablesProvider],
})
export class EnvironmentVariablesModule {}
