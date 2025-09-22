import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateParkingRecordManualProvider } from './providers/create-parking-record-manual.provider';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { UpdateParkingRecordManualProvider } from './providers/update-parking-record-manual.provider';
import { DeleteParkingRecordProvider } from './providers/delete-parking-record.provider';
import { FindOneParkingRecordProvider } from './providers/find-one-parking-record.provider';
import { FindManyParkingRecordProvider } from './providers/find-many-parking-record.provider';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';

@Injectable()
export class ParkingRecordService {
  public create: CreateParkingRecordManualProvider;
  public update: UpdateParkingRecordManualProvider;
  public delete: DeleteParkingRecordProvider;
  public findOne: FindOneParkingRecordProvider;
  public findMany: FindManyParkingRecordProvider;

  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    @Inject(forwardRef(() => VehicleService))
    private readonly vehicleService: VehicleService,
  ) {
    this.create = new CreateParkingRecordManualProvider(
      this.parkingRecordRepository,
      this.vehicleService,
    );
    this.update = new UpdateParkingRecordManualProvider(
      this.parkingRecordRepository,
    );
    this.delete = new DeleteParkingRecordProvider(this.parkingRecordRepository);
    this.findOne = new FindOneParkingRecordProvider(
      this.parkingRecordRepository,
    );
    this.findMany = new FindManyParkingRecordProvider(
      this.parkingRecordRepository,
    );
  }
}
