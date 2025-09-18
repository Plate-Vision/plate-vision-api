import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { HttpException } from '@nestjs/common';
import { VehicleEntity } from '../../entities/vehicle.entity';

export class FindOneVehicleProvider {
  public constructor(private readonly vehicleRepository: VehicleRepository) {}

  public async execute(data: { id: number }): Promise<VehicleEntity> {
    const customer = await this.vehicleRepository.manager.findOne({
      where: {
        id: data.id,
      },
      relations: ['userCreated', 'userUpdated'],
    });

    if (customer) return customer;

    throw new HttpException('Veículo não encontrado', 404);
  }
}
