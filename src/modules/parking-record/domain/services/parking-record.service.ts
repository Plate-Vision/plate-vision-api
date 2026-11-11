import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateParkingRecordManualProvider } from './providers/create-parking-record-manual.provider';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { UpdateParkingRecordManualProvider } from './providers/update-parking-record-manual.provider';
import { DeleteParkingRecordProvider } from './providers/delete-parking-record.provider';
import { FindOneParkingRecordProvider } from './providers/find-one-parking-record.provider';
import { FindManyParkingRecordProvider } from './providers/find-many-parking-record.provider';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { UpdateParkingRecordIaProvider } from './providers/update-parking-record-ia.provider';
import { UpsertParkingRecordIaProvider } from './providers/upsert-parking-record-ia.provider';

@Injectable()
export class ParkingRecordService {
  public create: CreateParkingRecordManualProvider;
  public update: UpdateParkingRecordManualProvider;
  public delete: DeleteParkingRecordProvider;
  public findOne: FindOneParkingRecordProvider;
  public findMany: FindManyParkingRecordProvider;
  public upsertIa: UpsertParkingRecordIaProvider;
  public updateIa: UpdateParkingRecordIaProvider;

  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    @Inject(forwardRef(() => VehicleService))
    private readonly vehicleService: VehicleService,
  ) {
    this.findOne = new FindOneParkingRecordProvider(
      this.parkingRecordRepository,
    );
    this.create = new CreateParkingRecordManualProvider(
      this.parkingRecordRepository,
      this.vehicleService.findOne,
      this.findOne,
    );
    this.update = new UpdateParkingRecordManualProvider(
      this.parkingRecordRepository,
      this.findOne,
    );
    this.delete = new DeleteParkingRecordProvider(
      this.parkingRecordRepository,
      this,
    );
    this.findMany = new FindManyParkingRecordProvider(
      this.parkingRecordRepository,
    );
    this.updateIa = new UpdateParkingRecordIaProvider(this.findOne);
    this.upsertIa = new UpsertParkingRecordIaProvider(
      this.parkingRecordRepository,
      this.updateIa,
    );
  }
}
