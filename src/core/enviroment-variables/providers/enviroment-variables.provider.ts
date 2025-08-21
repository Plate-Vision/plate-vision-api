import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailVariablesProvider } from './variables/mail-variables.provider';
import { DatabaseVariablesProvider } from './variables/database-variables.provider';
import { ApplicationVariablesProvider } from './variables/application-variables.provider';

@Injectable()
export class EnvironmentVariablesProvider {
  /**
   * Indicador se o ambiente é o ambiente de Desenvolvimento
   */
  public isDevelopment: boolean;

  /**
   * Variáveis para a conexão com a base de dados
   */
  public database: DatabaseVariablesProvider;

  /**
   * Variáveis de configuração da API
   */
  public application: ApplicationVariablesProvider;

  public constructor(private readonly configService?: ConfigService) {
    this.database = new DatabaseVariablesProvider(
      this.getAndValidate(`DATABASE_HOST`),
      this.getAndValidate('DATABASE_PORT'),
      this.getAndValidate('DATABASE_NAME'),
      this.getAndValidate('DATABASE_USER'),
      this.getAndValidate('DATABASE_PASS'),
    );

    this.application = new ApplicationVariablesProvider(
      this.getAndValidate('API_URL'),
      this.getAndValidate('API_PORT'),
      this.getAndValidate('API_DOC_PASS'),
      this.getAndValidate('API_AUTH_TOKEN'),
      this.getAndValidate('API_CLIENT_URL'),
    );

    this.isDevelopment = this.getAndValidate('NODE_ENV') == 'development';
  }

  private getAndValidate(key: string, optional?: boolean) {
    if (!this) {
      return;
    }

    if (!this.configService) {
      return this.getDataByProcess(key, optional);
    }

    const data = this.configService.get(key);

    if (!data) {
      const dataInProcess = this.getDataByProcess(key, optional);
      return dataInProcess;
    }

    return data;
  }

  private getDataByProcess(key: string, optional?: boolean) {
    const dataInProcess = process.env[key];

    if (!dataInProcess && !optional) {
      throw Error(`Variável de Ambiente ${key} não encontrada`);
    }

    return dataInProcess;
  }
}
