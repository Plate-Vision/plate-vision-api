import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('customers', 'Gerenciamento de clientes');
  }

  public default() {
    return this.applyProperties(this.login());
  }

  public withoutLogin() {
    return this.applyProperties();
  }
}

export const CustomerController = new Controller();
