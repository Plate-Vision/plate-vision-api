import { NestFactory } from '@nestjs/core';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { SwaggerDefinition } from '@core/config/swagger/swagger.definition';
import { ClassValidator } from '@core/config/validator/class-validator.config';
import { SecurityConfig } from '@core/config/security/security.config';
import { MetricsConfig } from '@core/config/metrics/metrics.config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const env = new EnvironmentVariablesProvider();

  SwaggerDefinition.start(app, env, 'doc');
  SecurityConfig.start(app);
  ClassValidator.start(app);
  MetricsConfig.start(app);

  const { port } = env.application;

  await app.listen(port);
}

bootstrap();
