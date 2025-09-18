import { Injectable } from '@nestjs/common';
import { CreateVehicleManualProvider } from './providers/create-vehicle-manual.provider';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { DeleteVehicleProvider } from './providers/delete-vehicle.provider';
import { FindOneVehicleProvider } from './providers/find-one-vehicle.provider';
import { FindManyVehicleProvider } from './providers/find-many.vehicle.provider';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { UpdateVehicleProvider } from './providers/update-vehicle.provider';

@Injectable()
export class VehicleService {
  public createManual: CreateVehicleManualProvider;
  public delete: DeleteVehicleProvider;
  public findOne: FindOneVehicleProvider;
  public findMany: FindManyVehicleProvider;
  public update: UpdateVehicleProvider;

  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly customerRepository: CustomerRepository,
  ) {
    this.createManual = new CreateVehicleManualProvider(
      this.vehicleRepository,
      this.customerRepository,
    );
    this.delete = new DeleteVehicleProvider(this.vehicleRepository);
    this.findOne = new FindOneVehicleProvider(this.vehicleRepository);
    this.findMany = new FindManyVehicleProvider(this.vehicleRepository);
    this.update = new UpdateVehicleProvider(
      this.vehicleRepository,
      this.customerRepository,
    );
  }
}
