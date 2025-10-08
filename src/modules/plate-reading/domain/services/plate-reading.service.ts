import { Injectable } from '@nestjs/common';
import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { UpdatePlateReadingProvider } from './providers/update-plate-reading.provider';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { ProcessorPlateReadingProvider } from './providers/processor-plate-reading.provider';
import { FindManyPlateReadingProvider } from './providers/find-many-plate-reading.provider';

@Injectable()
export class PlateReadingService {
  public findMany: FindManyPlateReadingProvider;
  public processor: ProcessorPlateReadingProvider;
  public update: UpdatePlateReadingProvider;

  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
    private readonly vehicleService: VehicleService,
    private readonly parkingRecordService: ParkingRecordService,
  ) {
    this.processor = new ProcessorPlateReadingProvider(
      this,
      this.vehicleService,
      this.parkingRecordService,
      this.plateReadingRepository,
    );
    this.update = new UpdatePlateReadingProvider(this.plateReadingRepository);
    this.findMany = new FindManyPlateReadingProvider(
      this.plateReadingRepository,
    );
  }
}
