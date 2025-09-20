import { Injectable } from '@nestjs/common';
import { CreateParkingRecordManualProvider } from './providers/create-parking-record-manual.provider';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { UpdateParkingRecordManualProvider } from './providers/update-parking-record-manual.provider';
import { DeleteParkingRecordProvider } from './providers/delete-parking-record.provider';
import { FindOneParkingRecordProvider } from './providers/find-one-parking-record.provider';

@Injectable()
export class ParkingRecordService {
  public create: CreateParkingRecordManualProvider;
  public update: UpdateParkingRecordManualProvider;
  public delete: DeleteParkingRecordProvider;
  public findOne: FindOneParkingRecordProvider;

  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {
    this.create = new CreateParkingRecordManualProvider(
      this.parkingRecordRepository,
      this.vehicleRepository,
    );
    this.update = new UpdateParkingRecordManualProvider(
      this.parkingRecordRepository,
    );
    this.delete = new DeleteParkingRecordProvider(this.parkingRecordRepository);
    this.findOne = new FindOneParkingRecordProvider(
      this.parkingRecordRepository,
    );
  }
}
