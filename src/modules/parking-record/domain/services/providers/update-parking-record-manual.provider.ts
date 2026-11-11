import { validateParkingPeriod } from '../helpers/validate-parking-period';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { UpdateParkingRecordDTO } from '../../dtos/update-parking-record.dto';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { EParkingRecordSource } from '../../enums/parking-record-source.enum';
import { ParkingRecordService } from '../parking-record.service';

export class UpdateParkingRecordManualProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly parkingRecordService: ParkingRecordService,
  ) {}

  public async execute(data: {
    uuid: string;
    data: UpdateParkingRecordDTO;
    authUser: UserEntity;
  }): Promise<ParkingRecordEntity> {
    const parkingRecord = await this.parkingRecordService.findOne.execute({
      uuid: data.uuid,
    });

    const finalEntryTime =
      data.data.entryTime !== undefined
        ? data.data.entryTime
        : parkingRecord.entryTime;
    const finalExitTime =
      data.data.exitTime !== undefined
        ? data.data.exitTime
        : parkingRecord.exitTime;
    validateParkingPeriod(finalEntryTime, finalExitTime);

    return await this.parkingRecordRepository.transaction(async (query) => {
      const updatedParkingRecord = await query.manager.save(
        this.toUpdatedParkingRecord(parkingRecord, data.data, data.authUser),
      );

      return updatedParkingRecord;
    });
  }

  private toUpdatedParkingRecord(
    parkingRecord: ParkingRecordEntity,
    data: UpdateParkingRecordDTO,
    user: UserEntity,
  ) {
    const updatedData = {
      ...parkingRecord,
      ...data,
      userUpdated: user,
      exitSource: EParkingRecordSource.MA,
    };

    if (!data.exitTime) {
      updatedData.exitTime = null;
    }

    return plainToInstance(ParkingRecordEntity, updatedData, {
      ignoreDecorators: true,
    });
  }
}
