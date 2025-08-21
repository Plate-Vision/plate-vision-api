import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { IConnection } from '../interfaces/connection.interface';
import { EConnection } from '../enums/connection.enum';
import { InitSeeder } from '../../seeds/init.seed';

export class Connection {
  private host: string;
  private port: number;
  private database: string;
  private userName: string;
  private password: string;
  private type: 'postgres' | 'mssql';
  private migration: string;
  public constructor(
    connection: EConnection,
    private readonly environmentsVariables: EnvironmentVariablesProvider,
    private readonly anotherFolderMigration?: string,
    private readonly suffixEntity?: string,
  ) {
    this.host = this.environmentsVariables.database.host;
    this.port = this.environmentsVariables.database.port;
    this.database = this.environmentsVariables.database.name;
    this.userName = this.environmentsVariables.database.user;
    this.password = this.environmentsVariables.database.pass;
    this.migration = `../../migration/${connection}/*.ts`;
    this.type = connection;
  }

  public getConnection(
    connectionVars?: IConnection,
  ): (TypeOrmModuleOptions | DataSourceOptions) & SeederOptions {
    const runningSeeds = process.env.RUNNING_SEED === 'true';

    const connection = {
      type: this.type ?? connectionVars.type,
      host: this.host ?? connectionVars.host,
      port: `${this.port}` == ` NaN` ? connectionVars.port : this.port,
      database: this.database ?? connectionVars.database,
      username: this.userName ?? connectionVars.username,
      password: this.password ?? connectionVars.password,
      autoLoadEntities: true,
      migrationsTableName: 'migrations_typeorm',
      entities: runningSeeds
        ? this.suffixEntity
          ? [`src/**/*.entity-${this.suffixEntity}{.ts,.js}`]
          : ['src/**/*.entity{.ts,.js}']
        : this.suffixEntity
          ? [`dist/**/*.entity-${this.suffixEntity}{.ts,.js}`]
          : ['dist/**/*.entity{.ts,.js}'],
      migrations: this.anotherFolderMigration
        ? [
            `dist/core/database/migrations/${this.anotherFolderMigration}/*{.js,.ts}`,
          ]
        : ['dist/core/database/migrations/*{.js,.ts}'],
      synchronize: false,
      seeds: [InitSeeder],
    };

    if (this.type == 'mssql') {
      connection['extra'] = {
        trustServerCertificate: true,
      };
    }

    return connection;
  }

  private static getEnv(connection: EConnection, variable: string) {
    return `${variable.toUpperCase()}_${connection.toUpperCase()}`;
  }
}
