import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';

import { EnvironmentVariablesModule } from '@core/enviroment-variables/enviroment-variables.module';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

import { DatabaseConnection } from './domain/connection/database.connection';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentVariablesModule],
      inject: [EnvironmentVariablesProvider],
      useFactory: async (env: EnvironmentVariablesProvider) => {
        const connection = new DatabaseConnection(env);
        return connection.getConnection();
      },
    }),
  ],
})
export class DatabaseModule {}
