import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';

import { MessagePayload } from '@shared/payloads/message.payload';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { ParkingRecordService } from '../parking-record.service';

export class DeleteParkingRecordProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly parkingRcordService: ParkingRecordService,
  ) {}

  public async execute(data: { uuid: string }): Promise<MessagePayload> {
    const parkingRecord = await this.parkingRcordService.findOne.execute({
      uuid: data.uuid,
    });

    await this.parkingRecordRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(ParkingRecordEntity, {
        id: parkingRecord.id,
      });
    });

    return { message: 'Registro deletado com sucesso' };
  }
}
