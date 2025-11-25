import { HttpException } from '@nestjs/common';

import { UpdateParkingRecordDTO } from '../../dtos/update-parking-record.dto';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { EParkingRecordSource } from '../../enums/parking-record-source.enum';
import { QueryRunner } from 'typeorm';
import { ParkingRecordService } from '../parking-record.service';

export class UpdateParkingRecordIaProvider {
  public constructor(
    private readonly parkingRecordService: ParkingRecordService,
  ) {}

  public async execute(data: {
    id: number;
    data: UpdateParkingRecordDTO;
    queryRunner?: QueryRunner;
  }): Promise<ParkingRecordEntity> {
    const parkingRecord = await this.parkingRecordService.findOne.executeById({
      id: data.id,
      queryRunner: data.queryRunner,
    });

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
