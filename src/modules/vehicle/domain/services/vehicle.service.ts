import { Injectable } from '@nestjs/common';
import { CreateVehicleManualProvider } from './providers/create-vehicle-manual.provider';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';

@Injectable()
export class VehicleService {
  public createManual: CreateVehicleManualProvider;

  public constructor(private readonly vehicleRepository: VehicleRepository) {
    this.createManual = new CreateVehicleManualProvider(this.vehicleRepository);
  }
}
