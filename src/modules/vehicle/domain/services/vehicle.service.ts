import { Injectable } from '@nestjs/common';
import { CreateVehicleManualProvider } from './providers/create-vehicle-manual.provider';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { DeleteVehicleProvider } from './providers/delete-vehicle.provider';
import { FindOneVehicleProvider } from './providers/find-one-vehicle.provider';
import { FindManyVehicleProvider } from './providers/find-many.vehicle.provider';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { UpdateVehicleProvider } from './providers/update-vehicle.provider';
import { CreateVehicleIaProvider } from './providers/create-vehicle-ia.provider';

@Injectable()
export class VehicleService {
  public create: CreateVehicleManualProvider;
  public delete: DeleteVehicleProvider;
  public findOne: FindOneVehicleProvider;
  public findMany: FindManyVehicleProvider;
  public update: UpdateVehicleProvider;

  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly customerService: CustomerService,
  ) {
    this.create = new CreateVehicleManualProvider(
      this.vehicleRepository,
      this.customerService,
    );
    this.delete = new DeleteVehicleProvider(this.vehicleRepository);
    this.findOne = new FindOneVehicleProvider(this.vehicleRepository);
    this.findMany = new FindManyVehicleProvider(this.vehicleRepository);
    this.update = new UpdateVehicleProvider(
      this.vehicleRepository,
      this.customerService,
    );
  }
}
