import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { PlateReadingEntity } from '../../entities/plate-reading.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { In, QueryRunner } from 'typeorm';

@Injectable()
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
      return await this.saveParkingRecordWithTransaction(
        platesReadings,
        data.queryRunner,
      );
    }

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

  private async saveParkingRecordWithTransaction(
    plateReading: PlateReadingEntity[],
    query: QueryRunner,
  ) {
    const plateReadings = await query.manager.save(
      PlateReadingEntity,
      await this.serializeCustomerData(plateReading),
    );

    return plateReadings;
  }

  private async serializeCustomerData(plateReading: PlateReadingEntity[]) {
    return plainToInstance(
      PlateReadingEntity,
      plateReading.map((item) => ({ ...item, processedAt: new Date() })),
      { ignoreDecorators: true },
    );
  }
}
