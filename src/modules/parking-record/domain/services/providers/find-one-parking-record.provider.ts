import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { HttpException } from '@nestjs/common';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';

export class FindOneParkingRecordProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
  ) {}

  public async execute(data: { id: number }): Promise<ParkingRecordEntity> {
    const parkingRecord = await this.parkingRecordRepository.manager.findOne({
      where: {
        id: data.id,
      },
      relations: ['userCreated', 'userUpdated', 'vehicle', 'vehicle.customer'],
    });

    if (parkingRecord) return parkingRecord;

    throw new HttpException('Registro não encontrado', 404);
  }
}
