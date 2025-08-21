import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('roles', 'Gerenciamento de perfis de usuário');
  }

  public default() {
    return this.applyProperties(this.login() /* todo: ability guard */);
  }
}

export const RoleController = new Controller();
