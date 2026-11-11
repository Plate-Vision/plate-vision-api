import { HttpException, Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { FindManyPlateReadingProvider } from './find-many-plate-reading.provider';
import { UpdatePlateReadingProvider } from './update-plate-reading.provider';
import { CreateVehicleIaProvider } from '@modules/vehicle/domain/services/providers/create-vehicle-ia.provider';
import { UpsertParkingRecordIaProvider } from '@modules/parking-record/domain/services/providers/upsert-parking-record-ia.provider';
import { PlateReadingEntity } from '../../entities/plate-reading.entity';
import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';

export class ProcessorPlateReadingProvider {
  private readonly logger = new Logger(ProcessorPlateReadingProvider.name);

  public constructor(
    private readonly findManyPlateReading: FindManyPlateReadingProvider,
    private readonly updatePlateReading: UpdatePlateReadingProvider,
    private readonly createVehicle: CreateVehicleIaProvider,
    private readonly upsertParkingRecord: UpsertParkingRecordIaProvider,
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
  public async execute() {
    const unprocessedPlates = await this.findManyPlateReading.execute();

    if (unprocessedPlates.length === 0) {
      this.logger.log('Nenhum dado para atualizar');
      return { message: 'Nenhum dado para atualizar' };
    }

    try {
      return await this.plateReadingRepository.transaction(
        async (queryRunner) => {
          await this.processPlates(unprocessedPlates, queryRunner);

          this.logger.log('Dados atualizados com sucesso');

          return { message: 'Dados atualizados com sucesso' };
        },
      );
    } catch (error) {
      this.logger.error('Falha ao processar as leituras de placa', error.stack);
      throw new HttpException('Falha ao processar as leituras de placa', 404);
    }
  }

  private async processPlates(
    plates: PlateReadingEntity[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const plate of plates) {
      const vehicle = await this.createVehicle.execute({
        dto: { licensePlate: plate.licensePlate },
        queryRunner,
      });

      if (vehicle && vehicle.isServiceVehicle === false) {
        await this.upsertParkingRecord.execute({
          dto: {
            vehicle: vehicle,
            entryTime: plate.createdAt,
            entryReadingId: plate.id,
          },
          dtoUpdate: {
            vehicle: vehicle,
            entryTime: plate.createdAt,
            entryReadingId: plate.id,
            exitTime: plate.createdAt,
            exitReadingId: plate.id,
          },
          queryRunner,
        });
      }
    }
    const ids = plates.map((item) => item.id);
    await this.updatePlateReading.execute({ ids, queryRunner });
  }
}
