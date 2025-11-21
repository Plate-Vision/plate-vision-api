import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CreateVehicleDTO } from '../../dtos/create-vehicle.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { QueryRunner } from 'typeorm';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { HttpException } from '@nestjs/common';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { EVehicleSource } from '../../enums/vehicle-source.enum';
import { ECustomerStatus } from '@modules/customer/domain/enums/customer-status.enum';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { VehicleService } from '../vehicle.service';

export class CreateVehicleManualProvider {
  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly customerService: CustomerService,
    private readonly vehicleService: VehicleService,
  ) { }

  public async execute({
    dto,
    authUser,
    queryRunner,
  }: {
    dto: CreateVehicleDTO;
    authUser: UserEntity;
    queryRunner?: QueryRunner;
  }): Promise<VehicleEntity> {
    const validateLicensePlate =
      await this.vehicleService.findOne.executeByLicensePlate(dto.licensePlate);

    if (validateLicensePlate) {
      throw new HttpException(
        'Já existe um veículo cadastrado com a placa informada',
        412,
      );
    }

    if (dto.customer) {
      const customer = await this.customerService.findOne.executeById({
        id: dto.customer.id,
      });

      if (customer.status === ECustomerStatus.INACTIVE) {
        throw new HttpException(
          'Não é possível vincular um veículo a um cliente inativo',
          412,
        );
      }
    }

    if (queryRunner) {
      return await this.saveVehicleWithTransaction(dto, authUser, queryRunner);
    }

    return await this.vehicleRepository.transaction(async (query) => {
      return await this.saveVehicleWithTransaction(dto, authUser, query);
    });
  }

  private async saveVehicleWithTransaction(
    dto: CreateVehicleDTO,
    authUser: UserEntity,
    query: QueryRunner,
  ) {
    const vehicle = await query.manager.save(
      VehicleEntity,
      await this.serialize(dto, authUser),
    );

    return vehicle;
  }

  private async serialize(dto: CreateVehicleDTO, authUser: UserEntity) {
    const serializedData: Partial<VehicleEntity> = {
      ...dto,
      userCreated: authUser,
      customer: dto.customer ?? null,
      source: EVehicleSource.MA,
      licensePlate: dto.licensePlate.toUpperCase(),
    };

    return serializedData;
  }
}
