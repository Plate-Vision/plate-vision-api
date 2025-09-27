import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, IsNull, QueryRunner } from 'typeorm';
import { PlateReadingService } from '../plate-reading.service';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { PlateReadingEntity } from '../../entities/plate-reading.entity';

@Injectable()
export class FindManyPlateReadingProvider {
  private readonly logger = new Logger(FindManyPlateReadingProvider.name);

  public constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    private readonly plateReadingRepository: PlateReadingRepository,
    private readonly plateReadingService: PlateReadingService,
    private readonly vehicleService: VehicleService,
    private readonly parkingRecordService: ParkingRecordService,
  ) {}
  public async execute() {
    const unprocessedPlates = await this.plateReadingRepository.manager.find({
      where: { processedAt: IsNull() },
      order: { id: 'ASC' },
    });

    if (unprocessedPlates.length === 0) {
      this.logger.log('Nenhuma leitura de placa para processar');
      return { message: 'Nenhum dado para atualizar' };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.processPlates(unprocessedPlates, queryRunner);

      this.logger.log(
        `${unprocessedPlates.length} placas processadas com sucesso`,
      );
      await queryRunner.commitTransaction();
      return { message: `Dados atualizados com sucesso` };
    } catch (error) {
      this.logger.error('Falha ao processar as leituras de placa', error.stack);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
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
