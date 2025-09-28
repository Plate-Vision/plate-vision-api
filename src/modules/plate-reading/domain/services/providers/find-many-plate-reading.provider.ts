import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { IsNull } from 'typeorm';

export class FindManyPlateReadingProvider {
  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
  public async execute() {
    const unprocessedPlates = await this.plateReadingRepository.manager.find({
      where: { processedAt: IsNull() },
      order: { id: 'ASC' },
    });

    if (unprocessedPlates) return unprocessedPlates;
  }
}
