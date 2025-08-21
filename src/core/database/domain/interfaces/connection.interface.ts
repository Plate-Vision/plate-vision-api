import { EConnection } from '../enums/connection.enum';

export interface IConnection {
  type: EConnection;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}
