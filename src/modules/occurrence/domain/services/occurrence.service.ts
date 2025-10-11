import { Injectable } from '@nestjs/common';
import { CreateOccurrenceProvider } from './providers/create-occurrence.provider';
import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { CreateImageProvider } from './providers/create-image.provider';
import { FindOneOccurrenceProvider } from './providers/find-one-occurrence.provider';
import { DeleteImageProvider } from './providers/delete-image.provider';
import { DeleteOccurrenceProvider } from './providers/delete-occurrence.provider';

@Injectable()
export class OccurrenceService {
  public create: CreateOccurrenceProvider;
  public createImage: CreateImageProvider;
  public findOne: FindOneOccurrenceProvider;
  public deleteImage: DeleteImageProvider;
  public delete: DeleteOccurrenceProvider;

  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
    private readonly vehicleService: VehicleService,
  ) {
    this.create = new CreateOccurrenceProvider(
      this.occurrenceRepository,
      this.vehicleService,
      this,
    );
    this.createImage = new CreateImageProvider();
    this.findOne = new FindOneOccurrenceProvider(this.occurrenceRepository);
    this.deleteImage = new DeleteImageProvider();
    this.delete = new DeleteOccurrenceProvider(this.occurrenceRepository, this);
  }
}
