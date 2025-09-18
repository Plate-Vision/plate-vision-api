import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { VehicleEntity } from '../../entities/vehicle.entity';
import { FindManyVehicleDTO } from '../../dtos/find-many-vehicle.dto';

export class FindManyVehicleProvider {
  public constructor(private readonly vehicleRepository: VehicleRepository) {}

  public async execute(params: { dto: FindManyVehicleDTO }) {
    let where: Array<FindOptionsWhere<VehicleEntity>> = [{}];
    const order: FindOptionsOrder<VehicleEntity> = {};

    if (params.dto.status) {
      where[0].status = params.dto.status;
    }

    if (params.dto.licensePlate) {
      where[0].licensePlate = ILike(`%${params.dto.licensePlate}%`);
    }

    if (params.dto.modelName) {
      where[0].modelName = ILike(`%${params.dto.modelName}%`);
    }

    if (params.dto.isServiceVehicle) {
      where[0].isServiceVehicle = params.dto.isServiceVehicle;
    }

    if (params.dto.orderBy) {
      order[params.dto.orderBy] = params.dto.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = params.dto;

    const [data, total] = await this.vehicleRepository.manager.findAndCount({
      where,
      order,
      take,
      skip,
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    if (!data.length) {
      return {
        data,
        total,
        pages,
        message: 'Nenhum veículo encontrado pelo filtro selecionado',
      };
    }

    return {
      data,
      total,
      pages,
    };
  }
}
