import { INestApplication } from '@nestjs/common';
import { ValidatorPipe } from './validator-pipe.config';

export class ClassValidator {
  /**
   * Inicialização do ClassValidator biblioteca responsável pela criação da validação dos Dtos
   * @param app Instancia da aplicação
   */
  public static start(app: INestApplication): void {
    app.useGlobalPipes(new ValidatorPipe());
  }
}
