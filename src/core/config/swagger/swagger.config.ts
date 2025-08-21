import * as basicAuth from 'express-basic-auth';

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { SwaggerTheme } from './swagger.theme';

export class SwaggerConfiguration {
  private name: string;
  private version: string;
  private description: string;
  private app: INestApplication<any>;
  private env: EnvironmentVariablesProvider;

  /**
   * Configuração da documentação da API através do Swagger
   * @param name Nome da aplicação
   * @param description Descrição da aplicação
   */
  public constructor(app: INestApplication, env: EnvironmentVariablesProvider) {
    this.version = process.env.npm_package_version;
    this.app = app;
    this.env = env;
  }
  /**
   * Definir nome á ser apresentado na documentação do Swagger
   * @param name Nome da aplicação
   */
  public setName(name: string) {
    this.name = name;
    return this;
  }
  /**
   * Definir descrição á ser apresentado na documentação do Swagger
   * @param description Descrição da aplicação
   */
  public setDescription(description: string) {
    this.description = description;
    return this;
  }

  /**
   * Iniciar e abrir rota para a documentação Swagger
   * @param url Url em que será disponibilizado a documentação
   */
  public async start(url: string) {
    const config = this.createConfig();
    const document = this.createDocument(config);
    return this.openPortToAccess(document, url);
  }

  private createConfig() {
    return new DocumentBuilder()
      .setTitle(this.name)
      .setDescription(this.description)
      .setVersion(this.env.isDevelopment ? 'Desenvolvimento' : this.version)
      .setContact('Gabriel Castelan', 'https://castelan.dev.br', '')
      .addBearerAuth()
      .build();
  }

  private createDocument(config: Omit<OpenAPIObject, 'paths'>) {
    const app = this.app;
    return SwaggerModule.createDocument(app, config);
  }

  private openPortToAccess(document: OpenAPIObject, url: string) {
    this.auth(url);
    const theme = new SwaggerTheme(this.env.application.url);

    return SwaggerModule.setup(url, this.app, document, {
      ...theme.customOptions,
      customSiteTitle: this.name,
      swaggerOptions: { persistAuthorization: true },
    });
  }

  private auth(url: string) {
    if (!this.env.isDevelopment) {
      this.app.use(
        [url, `${url}-json`],
        basicAuth({
          challenge: true,
          users: {
            admin: this.env.application.docPass,
          },
        }),
      );
    }
  }
}
