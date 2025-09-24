import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { HttpException } from '@nestjs/common';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { QueryRunner } from 'typeorm';

export class FindOneVehicleProvider {
  public constructor(private readonly vehicleRepository: VehicleRepository) {}

  public async execute(data: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<VehicleEntity> {
    const manager = data.queryRunner
      ? data.queryRunner.manager
      : this.vehicleRepository.manager;

    const customer = await manager.findOne(VehicleEntity, {
      where: {
        id: data.id,
      },
      relations: ['userCreated', 'userUpdated'],
    });

    if (customer) return customer;

    throw new HttpException('Veículo não encontrado', 404);
  }
}
