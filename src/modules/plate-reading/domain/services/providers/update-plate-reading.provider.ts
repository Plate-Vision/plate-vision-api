import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { PlateReadingEntity } from '../../entities/plate-reading.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { In, QueryRunner } from 'typeorm';

export class UpdatePlateReadingProvider {
  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
  public async execute(data: {
    ids: number[];
    queryRunner: QueryRunner;
  }): Promise<PlateReadingEntity[]> {
    const platesReadings = await this.findPlatesReadings(data.ids);

    if (data.queryRunner) {
      return await this.saveProcessedReadings(platesReadings, data.queryRunner);
    }

    return this.plateReadingRepository.transaction((query) =>
      query.manager.save(this.markReadingsProcessed(platesReadings)),
    );
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

    throw new HttpException(
      'Leituras de placas não encontrada',
      HttpStatus.NOT_FOUND,
    );
  }

  private saveProcessedReadings(
    plateReading: PlateReadingEntity[],
    query: QueryRunner,
  ) {
    return query.manager.save(
      PlateReadingEntity,
      this.markReadingsProcessed(plateReading),
    );
  }

  private markReadingsProcessed(plateReading: PlateReadingEntity[]) {
    return plainToInstance(
      PlateReadingEntity,
      plateReading.map((item) => ({ ...item, processedAt: new Date() })),
      { ignoreDecorators: true },
    );
  }
}
