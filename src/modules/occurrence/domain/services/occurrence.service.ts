import { Injectable } from '@nestjs/common';
import { CreateOccurrenceProvider } from './providers/create-occurrence.provider';
import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';

@Injectable()
export class OccurrenceService {
  public create: CreateOccurrenceProvider;

  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
    private readonly vehicleService: VehicleService,
  ) {
    this.create = new CreateOccurrenceProvider(
      occurrenceRepository,
      vehicleService,
    );
  }
}
