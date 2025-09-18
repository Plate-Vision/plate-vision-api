import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CreateVehicleDTO } from '../../dtos/create-vehicle.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ILike, QueryRunner } from 'typeorm';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { HttpException } from '@nestjs/common';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { EVehicleSource } from '../../enums/vehicle-source.enum';

export class CreateVehicleManualProvider {
  public constructor(private readonly vehicleRepository: VehicleRepository) {}

  public async execute({
    dto,
    authUser,
    customer,
    queryRunner,
  }: {
    dto: CreateVehicleDTO;
    authUser: UserEntity;
    customer?: CustomerEntity;
    queryRunner?: QueryRunner;
  }): Promise<VehicleEntity> {
    await this.validateLicensePlate(dto.licensePlate);

    if (queryRunner) {
      return await this.saveVehicleWithTransaction(
        dto,
        authUser,
        customer,
        queryRunner,
      );
    }

    return await this.vehicleRepository.transaction(async (query) => {
      return await this.saveVehicleWithTransaction(
        dto,
        authUser,
        customer,
        query,
      );
    });
  }

  private async validateLicensePlate(licensePlate: string) {
    const vehicle = await this.vehicleRepository.manager.findOne({
      where: { licensePlate: ILike(licensePlate) },
    });

    if (vehicle)
      throw new HttpException(
        'Já existe um veículo cadastrado com a placa informada',
        412,
      );
  }

  private async saveVehicleWithTransaction(
    dto: CreateVehicleDTO,
    authUser: UserEntity,
    customer: CustomerEntity,
    query: QueryRunner,
  ) {
    const vehicle = await query.manager.save(
      VehicleEntity,
      await this.serialize(dto, authUser, customer),
    );

    return vehicle;
  }

  private async serialize(
    dto: CreateVehicleDTO,
    authUser: UserEntity,
    customer: CustomerEntity,
  ) {
    return {
      ...dto,
      userCreated: authUser,
      customer: customer,
      source: EVehicleSource.MA,
      licensePlate: dto.licensePlate.toUpperCase(),
    };
  }
}
