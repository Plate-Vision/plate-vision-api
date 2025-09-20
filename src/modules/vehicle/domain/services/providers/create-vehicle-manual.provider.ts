import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CreateVehicleDTO } from '../../dtos/create-vehicle.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ILike, QueryRunner } from 'typeorm';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { HttpException } from '@nestjs/common';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { EVehicleSource } from '../../enums/vehicle-source.enum';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { ECustomerStatus } from '@modules/customer/domain/enums/customer-status.enum';

export class CreateVehicleManualProvider {
  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  public async execute({
    dto,
    authUser,
    queryRunner,
  }: {
    dto: CreateVehicleDTO;
    authUser: UserEntity;
    queryRunner?: QueryRunner;
  }): Promise<VehicleEntity> {
    await this.validateLicensePlate(dto.licensePlate);

    if (dto.customerId) {
      await this.validateCustomer(dto.customerId);
    }

    if (queryRunner) {
      return await this.saveVehicleWithTransaction(dto, authUser, queryRunner);
    }

    return await this.vehicleRepository.transaction(async (query) => {
      return await this.saveVehicleWithTransaction(dto, authUser, query);
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

  private async validateCustomer(customerId: number) {
    const customer = await this.customerRepository.manager.findOne({
      where: { id: customerId },
    });

    if (!customer || customer.status === ECustomerStatus.INACTIVE) {
      throw new HttpException('Cliente não encontrado ou inativo', 412);
    }
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
      source: EVehicleSource.MA,
      licensePlate: dto.licensePlate.toUpperCase(),
    };

    if (dto.customerId) {
      serializedData.customer = { id: dto.customerId } as CustomerEntity;
    }

    return serializedData;
  }
}
