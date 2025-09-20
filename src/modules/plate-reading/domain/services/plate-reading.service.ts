import { Injectable } from '@nestjs/common';
import { FindManyPlateReadingProvider } from './providers/find-many.plate-reading.provider';
import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';

@Injectable()
export class PlateReadingService {
  public findMany: FindManyPlateReadingProvider;

  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {
    this.findMany = new FindManyPlateReadingProvider(
      this.plateReadingRepository,
    );
  }
}
