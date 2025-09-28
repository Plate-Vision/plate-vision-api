import { ILike } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { UpdateVehicleDTO } from '../../dtos/update-vehicle.dto';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { ECustomerStatus } from '@modules/customer/domain/enums/customer-status.enum';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { VehicleService } from '../vehicle.service';

export class UpdateVehicleProvider {
  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly customerService: CustomerService,
    private readonly vehicleService: VehicleService,
  ) {}

  public async execute(data: {
    uuid: string;
    data: UpdateVehicleDTO;
    authUser?: UserEntity;
  }): Promise<VehicleEntity> {
    const vehicle = await this.vehicleService.findOne.execute(data.uuid);

    if (data.data.customerId) {
      const customer = await this.customerService.findOne.executeById({
        id: data.data.customerId,
      });

      if (customer.status === ECustomerStatus.INACTIVE) {
        throw new HttpException(
          'Não é possível vincular um veículo a um cliente inativo',
          412,
        );
      }
    }

    await this.validateLicensePlate(data.data.licensePlate, vehicle.id);

    return await this.vehicleRepository.transaction(async (query) => {
      const updatedVehicle = await query.manager.save(
        await this.serializeCustomerData(vehicle, data.data, data.authUser),
      );

      return updatedVehicle;
    });
  }

  private async validateLicensePlate(licensePlate: string, id: number) {
    const vehicle =
      await this.vehicleService.findOne.executeByLicensePlate(licensePlate);

    if (vehicle && vehicle.id !== id) {
      throw new HttpException(
        'Já existe um veículo cadastrado com a placa informada',
        412,
      );
    }
  }

  private async serializeCustomerData(
    vehicle: VehicleEntity,
    data: UpdateVehicleDTO,
    user: UserEntity,
  ) {
    return plainToInstance(
      VehicleEntity,
      { ...vehicle, ...data, userUpdated: user, customer: data.customerId },
      { ignoreDecorators: true },
    );
  }
}
