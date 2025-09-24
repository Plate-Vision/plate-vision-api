import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CreateVehicleDTO } from '../../dtos/create-vehicle.dto';
import { ILike, QueryRunner } from 'typeorm';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { EVehicleSource } from '../../enums/vehicle-source.enum';

export class CreateVehicleIaProvider {
  public constructor(private readonly vehicleRepository: VehicleRepository) {}

  public async execute({
    dto,
    queryRunner,
  }: {
    dto: CreateVehicleDTO;
    queryRunner?: QueryRunner;
  }): Promise<VehicleEntity> {
    const vehicleForUpdate = await this.validateLicensePlate(
      dto.licensePlate,
      queryRunner,
    );

    if (vehicleForUpdate) {
      return vehicleForUpdate;
    }

    if (queryRunner) {
      return await this.saveVehicleWithTransaction(dto, queryRunner);
    }

    return await this.vehicleRepository.transaction(async (query) => {
      return await this.saveVehicleWithTransaction(dto, query);
    });
  }

  private async validateLicensePlate(
    licensePlate: string,
    queryRunner?: QueryRunner,
  ) {
    const manager = queryRunner
      ? queryRunner.manager
      : this.vehicleRepository.manager;

    const vehicle = await manager.findOne(VehicleEntity, {
      where: { licensePlate: ILike(licensePlate) },
    });

    if (vehicle) return vehicle;
  }

  private async saveVehicleWithTransaction(
    dto: CreateVehicleDTO,
    query: QueryRunner,
  ) {
    const vehicle = await query.manager.save(
      VehicleEntity,
      await this.serialize(dto),
    );

    return vehicle;
  }

  private async serialize(dto: CreateVehicleDTO) {
    return {
      ...dto,
      source: EVehicleSource.AI,
      licensePlate: dto.licensePlate.toUpperCase(),
    };
  }
}
