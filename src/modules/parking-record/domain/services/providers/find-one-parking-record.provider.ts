import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { HttpException } from '@nestjs/common';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { QueryRunner } from 'typeorm';
import { validate as isUUID } from 'uuid';

export class FindOneParkingRecordProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
  ) {}

  public async execute(data: { uuid: string }): Promise<ParkingRecordEntity> {
    if (!isUUID(data.uuid)) {
      throw new HttpException('Registro não encontrado', 404);
    }

    const parkingRecord = await this.parkingRecordRepository.manager.findOne({
      where: {
        uuid: data.uuid,
      },
      relations: ['userCreated', 'userUpdated', 'vehicle', 'vehicle.customer'],
    });

    if (parkingRecord) return parkingRecord;

    throw new HttpException('Registro não encontrado', 404);
  }

  public async executeById(data: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<ParkingRecordEntity> {
    let parkingRecord: ParkingRecordEntity | null;

    if (data.queryRunner) {
      parkingRecord = await data.queryRunner.manager.findOne(
        ParkingRecordEntity,
        {
          where: { id: data.id },
        },
      );
    } else {
      parkingRecord = await this.parkingRecordRepository.manager.findOne({
        where: { id: data.id },
      });
    }

    if (parkingRecord) {
      return parkingRecord;
    }

    throw new HttpException('Registro não encontrado', 404);
  }
}
