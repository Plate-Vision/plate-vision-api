import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';

export class DeleteParkingRecordProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
  ) {}

  public async execute(data: { id: number }): Promise<MessagePayload> {
    const parkingRecord = await this.findParkingRecord(data.id);

    await this.parkingRecordRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(ParkingRecordEntity, {
        id: parkingRecord.id,
      });
    });

    return { message: 'Registro deletado com sucesso' };
  }

  private async findParkingRecord(id: number) {
    const parkingRecord = await this.parkingRecordRepository.manager.findOne({
      where: {
        id,
      },
    });

    if (parkingRecord) {
      return parkingRecord;
    }

    throw new HttpException('Registro não encontrado', 404);
  }
}
