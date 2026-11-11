import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { Between, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { FindManyParkingRecordDTO } from '../../dtos/find-many-parking-record.dto';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';

export class FindManyParkingRecordProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
  ) {}

  public async execute(params: { dto: FindManyParkingRecordDTO }) {
    const where: Array<FindOptionsWhere<ParkingRecordEntity>> = [{}];
    const order: FindOptionsOrder<ParkingRecordEntity> = {};

    if (params.dto.entrySource) {
      where[0].entrySource = params.dto.entrySource;
    }

    if (params.dto.exitSource) {
      where[0].exitSource = params.dto.exitSource;
    }

    if (params.dto.vehicleId) {
      where[0].vehicle = { id: params.dto.vehicleId };
    }

    if (params.dto.entryTime) {
      const date = new Date(params.dto.entryTime);

      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);

      where[0].entryTime = Between(startDate, endDate);
    }

    if (params.dto.exitTime) {
      const date = new Date(params.dto.exitTime);

      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);

      where[0].exitTime = Between(startDate, endDate);
    }

    if (params.dto.orderBy) {
      order[params.dto.orderBy] = params.dto.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = params.dto;

    const [data, total] =
      await this.parkingRecordRepository.manager.findAndCount({
        where,
        order,
        take,
        skip,
        relations: ['vehicle', 'vehicle.customer'],
      });

    const pages = total ? Math.round(total / (take || total)) : 0;

    if (!data.length) {
      return {
        data,
        total,
        pages,
        message: 'Nenhum registro encontrado pelo filtro selecionado',
      };
    }

    return {
      data,
      total,
      pages,
    };
  }
}
