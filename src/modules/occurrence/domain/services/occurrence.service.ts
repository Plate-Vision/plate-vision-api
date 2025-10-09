import { Injectable } from '@nestjs/common';
import { CreateOccurrenceProvider } from './providers/create-occurrence.provider';
import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { ImageUploadProvider } from './providers/image-upload.provider';

@Injectable()
export class OccurrenceService {
  public create: CreateOccurrenceProvider;
  public imageUpload: ImageUploadProvider;

  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
    private readonly vehicleService: VehicleService,
  ) {
    this.create = new CreateOccurrenceProvider(
      this.occurrenceRepository,
      this.vehicleService,
      this,
    );
    this.imageUpload = new ImageUploadProvider();
  }
}
