import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { HttpException } from '@nestjs/common';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { ILike, QueryRunner } from 'typeorm';
import { validate as isUUID } from 'uuid';

export class FindOneVehicleProvider {
  public constructor(private readonly vehicleRepository: VehicleRepository) {}

  public async execute(uuid: string): Promise<VehicleEntity> {
    if (!isUUID(uuid)) {
      throw new HttpException('Veículo não encontrado', 404);
    }

    const vehicle = await this.vehicleRepository.manager.findOne({
      where: {
        uuid: uuid,
      },
      relations: ['userCreated', 'userUpdated'],
    });

    if (vehicle) return vehicle;

    throw new HttpException('Veículo não encontrado', 404);
  }

  public async executeById(data: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<VehicleEntity> {
    let vehicle: VehicleEntity | null;

    if (data.queryRunner) {
      vehicle = await data.queryRunner.manager.findOne(VehicleEntity, {
        where: { id: data.id },
      });
    } else {
      vehicle = await this.vehicleRepository.manager.findOne({
        where: { id: data.id },
      });
    }

    if (vehicle) {
      return vehicle;
    }

    throw new HttpException('Veículo não encontrado', 404);
  }

  public async executeByLicensePlate(
    licensePlate: string,
    queryRunner?: QueryRunner,
  ): Promise<VehicleEntity> {
    let vehicle: VehicleEntity | null;

    if (queryRunner) {
      vehicle = await queryRunner.manager.findOne(VehicleEntity, {
        where: { licensePlate: ILike(licensePlate) },
      });
    } else {
      vehicle = await this.vehicleRepository.manager.findOne({
        where: {
          licensePlate: ILike(licensePlate),
        },
      });
    }

    if (vehicle) return vehicle;
  }
}
