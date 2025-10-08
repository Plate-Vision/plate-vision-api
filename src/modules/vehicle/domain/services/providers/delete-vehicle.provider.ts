import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { VehicleService } from '../vehicle.service';

export class DeleteVehicleProvider {
  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly vehicleService: VehicleService,
  ) {}

  public async execute(data: { uuid: string }): Promise<MessagePayload> {
    const vehicle = await this.vehicleService.findOne.execute(data.uuid);

    await this.vehicleRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(VehicleEntity, {
        uuid: vehicle.uuid,
      });
    });

    return { message: 'Veículo deletado com sucesso' };
  }
}
