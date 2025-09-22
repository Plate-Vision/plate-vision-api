import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { PlateReadingService } from '../plate-reading.service';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';

@Injectable()
export class FindManyPlateReadingProvider {
  public constructor(
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
      return {
        message: 'Nenhum dado para atualizar',
      };
    }

    try {
      for (const plate of unprocessedPlates) {
        const vehicle = await this.vehicleService.createIa.execute({
          dto: { licensePlate: plate.licensePlate },
        });

        if (vehicle) {
          await this.parkingRecordService.createIa.execute({
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
          });
        }
      }

      const ids = unprocessedPlates.map((item) => item.id);
      const result = await this.plateReadingService.update.execute({
        ids,
      });

      if (result) {
        return {
          message: `Dados atualizados`,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }
}
