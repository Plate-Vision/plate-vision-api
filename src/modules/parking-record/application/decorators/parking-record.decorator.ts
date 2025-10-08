import { ControllerDecorator } from '@core/base/decorators/route.decorator';

class Controller extends ControllerDecorator {
  public constructor() {
    super('parkings', 'Gerenciamento de registros de estacionamento');
  }

  public default() {
    return this.applyProperties(this.login());
  }

  public withoutLogin() {
    return this.applyProperties();
  }
}

export const ParkingRecordController = new Controller();
