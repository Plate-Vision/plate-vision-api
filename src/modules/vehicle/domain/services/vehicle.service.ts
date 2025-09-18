import { Injectable } from '@nestjs/common';
import { CreateVehicleManualProvider } from './providers/create-vehicle-manual.provider';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { DeleteVehicleProvider } from './providers/delete-vehicle.provider';
import { FindOneVehicleProvider } from './providers/find-one-vehicle.provider';

@Injectable()
export class VehicleService {
  public createManual: CreateVehicleManualProvider;
  public delete: DeleteVehicleProvider;
  public findOne: FindOneVehicleProvider;

  public constructor(private readonly vehicleRepository: VehicleRepository) {
    this.createManual = new CreateVehicleManualProvider(this.vehicleRepository);
    this.delete = new DeleteVehicleProvider(this.vehicleRepository);
    this.findOne = new FindOneVehicleProvider(this.vehicleRepository);
  }
}
