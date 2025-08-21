import helmet from 'helmet';

import { INestApplication } from '@nestjs/common';

export class SecurityConfig {
  /**
   * Inicialização da configuração de segurança do acesso via HTTP á API
   * @param app Instancia da aplicação
   */
  public static start(app: INestApplication) {
    app.enableCors({ 
      credentials: true, 
      origin: ['http://localhost:5173', process.env.API_CLIENT_URL]
    });
    app.use(helmet());
  }
}
