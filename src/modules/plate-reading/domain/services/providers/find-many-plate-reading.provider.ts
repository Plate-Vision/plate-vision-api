import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { PlateReadingService } from '../plate-reading.service';

@Injectable()
export class FindManyPlateReadingProvider {
  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
    private readonly plateReadingService: PlateReadingService,
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

    const result = await this.plateReadingService.update.execute({ ids });

    if (result) {
      return {
        message: `Dados atualizados`,
      };
    }
  }
}
