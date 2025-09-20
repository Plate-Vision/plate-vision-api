import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { PlateReadingEntity } from '../../entities/plate-reading.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { In } from 'typeorm';

@Injectable()
export class UpdatePlateReadingProvider {
  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
  public async execute(data: { ids: number[] }): Promise<PlateReadingEntity[]> {
    const platesReadings = await this.findPlatesReadings(data.ids);

    return await this.plateReadingRepository.transaction(async (query) => {
      const updatedPlateReading = await query.manager.save(
        await this.serializeCustomerData(platesReadings),
      );

      return updatedPlateReading;
    });
  }

  private async findPlatesReadings(ids: number[]) {
    const foundPlatesReadings = await this.plateReadingRepository.manager.find({
      where: {
        id: In(ids),
      },
    });

    if (foundPlatesReadings) {
      return foundPlatesReadings;
    }

    throw new HttpException('Leituras de placas não encontrada', 404);
  }

  private async serializeCustomerData(plateReading: PlateReadingEntity[]) {
    return plainToInstance(
      PlateReadingEntity,
      plateReading.map((item) => ({ ...item, processedAt: new Date() })),
      { ignoreDecorators: true },
    );
  }
}
