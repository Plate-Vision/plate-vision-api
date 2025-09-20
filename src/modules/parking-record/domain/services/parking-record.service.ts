import { Injectable } from '@nestjs/common';
import { CreateParkingRecordManualProvider } from './providers/create-parking-record-manual.provider';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { UpdateParkingRecordManualProvider } from './providers/update-parking-record-manual.provider';

@Injectable()
export class ParkingRecordService {
  public create: CreateParkingRecordManualProvider;
  public update: UpdateParkingRecordManualProvider;

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
  }
}
