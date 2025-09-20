import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindManyPlateReadingProvider {
  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
  public async execute() {
    const data = await this.plateReadingRepository.manager.find({
      where: { processedAt: null },
    });

    if (!data.length) {
      return {
        message: 'Nenhum dado para atualizar',
      };
    }

    return {
      data,
    };
  }
}
