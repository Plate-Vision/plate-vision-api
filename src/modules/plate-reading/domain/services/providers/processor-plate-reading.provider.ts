import { Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { PlateReadingService } from '../plate-reading.service';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { PlateReadingEntity } from '../../entities/plate-reading.entity';
import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';

export class ProcessorPlateReadingProvider {
  private readonly logger = new Logger(ProcessorPlateReadingProvider.name);

  public constructor(
    private readonly plateReadingService: PlateReadingService,
    private readonly vehicleService: VehicleService,
    private readonly parkingRecordService: ParkingRecordService,
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
  public async execute() {
    const unprocessedPlates = await this.plateReadingService.findMany.execute();

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
    }
  }

  private async processPlates(
    plates: PlateReadingEntity[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const plate of plates) {
      const vehicle = await this.vehicleService.createIa.execute({
        dto: { licensePlate: plate.licensePlate },
        queryRunner,
      });

      if (vehicle) {
        await this.parkingRecordService.upsertIa.execute({
          dto: {
            vehicleId: vehicle.id,
            entryTime: plate.createdAt,
            entryReadingId: plate.id,
          },
          dtoUpdate: {
            vehicleId: vehicle.id,
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
    await this.plateReadingService.update.execute({ ids, queryRunner });
  }
}
