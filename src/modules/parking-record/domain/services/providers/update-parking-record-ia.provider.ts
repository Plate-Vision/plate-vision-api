import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { UpdateParkingRecordDTO } from '../../dtos/update-parking-record.dto';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { EParkingRecordSource } from '../../enums/parking-record-source.enum';
import { QueryRunner } from 'typeorm';

export class UpdateParkingRecordIaProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
  ) {}

  public async execute(data: {
    id: number;
    data: UpdateParkingRecordDTO;
    queryRunner?: QueryRunner;
  }): Promise<ParkingRecordEntity> {
    const parkingRecord = await this.findParkingRecord(
      data.id,
      data.queryRunner,
    );

    await this.validateDate(data.data, parkingRecord);

    const serializedData = await this.serializeCustomerData(
      parkingRecord,
      data.data,
    );

    if (data.queryRunner) {
      return await data.queryRunner.manager.save(
        ParkingRecordEntity,
        serializedData,
      );
    }
  }

  private async findParkingRecord(id: number, queryRunner?: QueryRunner) {
    const manager = queryRunner
      ? queryRunner.manager
      : this.parkingRecordRepository.manager;

    const foundParkingRecord = await manager.findOne(ParkingRecordEntity, {
      where: { id },
    });

    if (foundParkingRecord) {
      return foundParkingRecord;
    }

    throw new HttpException('Registro não encontrado', 404);
  }

  private async validateDate(
    newValues: UpdateParkingRecordDTO,
    originalRecord: ParkingRecordEntity,
  ) {
    const finalEntryTime = newValues.entryTime || originalRecord.entryTime;
    const finalExitTime = newValues.exitTime || originalRecord.exitTime;

    if (finalEntryTime && finalExitTime && finalExitTime < finalEntryTime) {
      throw new HttpException(
        'A data e hora de saída não pode ser menor que a data e hora de entrada',
        412,
      );
    }
  }

  private async serializeCustomerData(
    parkingRecord: ParkingRecordEntity,
    data: UpdateParkingRecordDTO,
  ) {
    return {
      ...parkingRecord,
      ...data,
      entryReading: parkingRecord.entryReading,
      exitReading: data.exitReadingId
        ? { id: data.exitReadingId }
        : parkingRecord.exitReading,
      entryTime: parkingRecord.entryTime,
      exitTime: data.exitTime,
      exitSource: EParkingRecordSource.AI,
    };
  }
}
