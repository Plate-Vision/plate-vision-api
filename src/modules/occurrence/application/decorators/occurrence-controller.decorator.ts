import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('occurrences', 'Gerenciamento de ocorrências');
  }

  public default() {
    return this.applyProperties(this.login());
  }

  public withoutLogin() {
    return this.applyProperties();
  }
}

export const OccurrenceController = new Controller();
