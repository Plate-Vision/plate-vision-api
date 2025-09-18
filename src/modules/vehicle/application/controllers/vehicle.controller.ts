import { DefaultVehicleController } from './routes/default-vehicle.route';
import { WithoutLoginVehicleController } from './routes/without-login-vehicle.route';

export const VehicleControllers = [
  DefaultVehicleController,
  WithoutLoginVehicleController,
];
