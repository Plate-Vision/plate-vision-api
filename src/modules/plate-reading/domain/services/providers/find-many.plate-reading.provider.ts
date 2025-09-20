import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { Injectable } from '@nestjs/common';
import { UpdatePlateReadingProvider } from './update.plate-reading.provider';
import { IsNull } from 'typeorm';

@Injectable()
export class FindManyPlateReadingProvider {
  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
    private readonly updatePlateReadingProvider: UpdatePlateReadingProvider,
  ) {}
  public async execute() {
    const data = await this.plateReadingRepository.manager.find({
      where: { processedAt: IsNull() },
    });

    if (!data.length) {
      return {
        message: 'Nenhum dado para atualizar',
      };
    }

    const ids = data.map((item) => item.id);

    const result = await this.updatePlateReadingProvider.execute({ ids });

    if (result) {
      return {
        message: `Dados atualizados`,
      };
    }
  }
}
