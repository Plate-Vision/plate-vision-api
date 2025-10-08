import { HttpException } from '@nestjs/common';
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

    await this.validateDate(data.data, parkingRecord);

    return await this.parkingRecordRepository.transaction(async (query) => {
      const updatedParkingRecord = await query.manager.save(
        await this.serializeCustomerData(
          parkingRecord,
          data.data,
          data.authUser,
        ),
      );

      return updatedParkingRecord;
    });
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
    user: UserEntity,
  ) {
    return plainToInstance(
      ParkingRecordEntity,
      {
        ...parkingRecord,
        ...data,
        userUpdated: user,
        exitSource: EParkingRecordSource.MA,
      },
      { ignoreDecorators: true },
    );
  }
}
