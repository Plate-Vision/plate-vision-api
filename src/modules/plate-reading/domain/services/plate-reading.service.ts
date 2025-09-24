import { Inject, Injectable } from '@nestjs/common';
import { FindManyPlateReadingProvider } from './providers/find-many-plate-reading.provider';
import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { UpdatePlateReadingProvider } from './providers/update-plate-reading.provider';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { DataSource } from 'typeorm';

@Injectable()
export class PlateReadingService {
  public findMany: FindManyPlateReadingProvider;
  public update: UpdatePlateReadingProvider;

  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
    private readonly vehicleService: VehicleService,
    private readonly parkingRecordService: ParkingRecordService,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {
    this.findMany = new FindManyPlateReadingProvider(
      this.dataSource,
      this.plateReadingRepository,
      this,
      this.vehicleService,
      this.parkingRecordService,
    );
    this.update = new UpdatePlateReadingProvider(this.plateReadingRepository);
  }
}
