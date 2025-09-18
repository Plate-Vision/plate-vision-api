import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';
import { VehicleEntity } from '../../entities/vehicle.entity';

export class DeleteVehicleProvider {
  public constructor(private readonly vehicleRepository: VehicleRepository) {}

  public async execute(data: { id: number }): Promise<MessagePayload> {
    const customer = await this.findCustomer(data.id);

    await this.vehicleRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(VehicleEntity, { id: customer.id });
    });

    return { message: 'Veículo deletado com sucesso' };
  }

  private async findCustomer(id: number) {
    const customer = await this.vehicleRepository.manager.findOne({
      where: {
        id,
      },
    });

    if (customer) {
      return customer;
    }

    throw new HttpException('Veículo não encontrado', 404);
  }
}
