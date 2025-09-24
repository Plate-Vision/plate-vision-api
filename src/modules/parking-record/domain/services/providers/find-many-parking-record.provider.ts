import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { FindManyParkingRecordDTO } from '../../dtos/find-many-parking-record.dto';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';

export class FindManyParkingRecordProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
  ) {}

  public async execute(params: { dto: FindManyParkingRecordDTO }) {
    let where: Array<FindOptionsWhere<ParkingRecordEntity>> = [{}];
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
      where[0].entryTime = params.dto.entryTime;
    }

    if (params.dto.exitTime) {
      where[0].exitTime = params.dto.exitTime;
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
