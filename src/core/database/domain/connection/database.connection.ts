import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { EConnection } from '../enums/connection.enum';
import { Connection } from '../classes/connection.class';

export class DatabaseConnection extends Connection {
  public constructor(env: EnvironmentVariablesProvider) {
    super(EConnection.DATABASE, env);
  }
}
