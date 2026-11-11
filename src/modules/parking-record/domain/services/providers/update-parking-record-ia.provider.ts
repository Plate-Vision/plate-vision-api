import { validateParkingPeriod } from '../helpers/validate-parking-period';

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

    const finalEntryTime = data.data.entryTime || parkingRecord.entryTime;
    const finalExitTime = data.data.exitTime || parkingRecord.exitTime;
    validateParkingPeriod(finalEntryTime, finalExitTime);

    const serializedData = this.toAiExitRecord(parkingRecord, data.data);

    if (data.queryRunner) {
      return await data.queryRunner.manager.save(
        ParkingRecordEntity,
        serializedData,
      );
    }
  }

  private toAiExitRecord(
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
