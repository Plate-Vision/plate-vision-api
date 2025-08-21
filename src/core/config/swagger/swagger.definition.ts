import { INestApplication } from '@nestjs/common';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

import { SwaggerConfiguration } from './swagger.config';

export class SwaggerDefinition {
  /**
   * Inicializar documentação do Swagger
   * @param app Instancia da aplicação
   * @param url Url que será liberada para visualização desta documentação
   */
  public static start(
    app: INestApplication,
    env: EnvironmentVariablesProvider,
    url: string,
  ) {
    new SwaggerConfiguration(app, env)
      .setName('Portal')
      .setDescription('API do Portal')
      .start(url);
  }
}
