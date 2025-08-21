import { DataSource, DataSourceOptions } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { DatabaseConnection } from './database.connection';
import 'dotenv/config';

const env = new EnvironmentVariablesProvider();

export const dataSource = new DataSource(
  new DatabaseConnection(env).getConnection() as DataSourceOptions,
);
