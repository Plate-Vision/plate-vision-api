import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('auth', 'Autenticação');
  }

  public default() {
    return this.applyProperties();
  }

  public user() {
    return this.applyPropertiesWithSuffix('user', this.login());
  }
}

export const AuthController = new Controller();
