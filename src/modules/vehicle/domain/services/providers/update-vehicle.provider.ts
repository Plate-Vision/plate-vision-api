import { ILike } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { UpdateVehicleDTO } from '../../dtos/update-vehicle.dto';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { ECustomerStatus } from '@modules/customer/domain/enums/customer-status.enum';
import { CustomerService } from '@modules/customer/domain/services/customer.service';

export class UpdateVehicleProvider {
  public constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly customerService: CustomerService,
  ) {}

  public async execute(data: {
    id: number;
    data: UpdateVehicleDTO;
    authUser?: UserEntity;
  }): Promise<VehicleEntity> {
    const vehicle = await this.findVehicle(data.id);

    if (data.data.customerId) {
      const customer = await this.customerService.findOne.execute({
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

  private async findVehicle(id: number) {
    const foundVehicle = await this.vehicleRepository.manager.findOne({
      where: {
        id,
      },
    });

    if (foundVehicle) {
      return foundVehicle;
    }

    throw new HttpException('Veículo não encontrado', 404);
  }

  private async validateLicensePlate(licensePlate: string, id: number) {
    const vehicle = await this.vehicleRepository.manager.findOne({
      where: { licensePlate: ILike(licensePlate) },
    });

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
