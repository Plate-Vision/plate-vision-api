import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CreateVehicleDTO } from '../../dtos/create-vehicle.dto';
import { QueryRunner } from 'typeorm';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { EVehicleSource } from '../../enums/vehicle-source.enum';
import { FindOneVehicleProvider } from './find-one-vehicle.provider';

export class CreateVehicleIaProvider {
  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly findOneVehicle: FindOneVehicleProvider,
  ) {}

  public async execute({
    dto,
    queryRunner,
  }: {
    dto: CreateVehicleDTO;
    queryRunner?: QueryRunner;
  }): Promise<VehicleEntity> {
    const vehicleForUpdate = await this.findOneVehicle.executeByLicensePlate(
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

  private saveVehicleWithTransaction(
    dto: CreateVehicleDTO,
    query: QueryRunner,
  ) {
    return query.manager.save(VehicleEntity, this.toAiVehicle(dto));
  }

  private toAiVehicle(dto: CreateVehicleDTO) {
    return {
      ...dto,
      source: EVehicleSource.AI,
      licensePlate: dto.licensePlate.toUpperCase(),
    };
  }
}
