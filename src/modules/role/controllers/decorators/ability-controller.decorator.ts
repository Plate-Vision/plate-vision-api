import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('abilities', 'Gerenciamento de habilidades');
  }

  public default() {
    return this.applyProperties(this.login() /* todo: ability guard */);
  }
}

export const AbilityController = new Controller();
