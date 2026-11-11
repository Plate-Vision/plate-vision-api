import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { CreateParkingRecordDTO } from '../../dtos/create-parking-record.dto';
import { QueryRunner } from 'typeorm';
import { EParkingRecordSource } from '../../enums/parking-record-source.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { ParkingRecordService } from '../parking-record.service';
import { UpdateParkingRecordDTO } from '../../dtos/update-parking-record.dto';

export class UpsertParkingRecordIaProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly parkingRecordService: ParkingRecordService,
  ) {}

  public async execute({
    dto,
    dtoUpdate,
    queryRunner,
  }: {
    dto: CreateParkingRecordDTO;
    dtoUpdate: UpdateParkingRecordDTO;
    queryRunner?: QueryRunner;
  }): Promise<ParkingRecordEntity> {
    const parkingRecordUpdate = await this.validateParkingRecord(
      dto.vehicle,
      dtoUpdate,
      queryRunner,
    );

    if (parkingRecordUpdate) {
      return parkingRecordUpdate;
    }

    if (queryRunner) {
      return await this.saveParkingRecordWithTransaction(dto, queryRunner);
    }

    return await this.parkingRecordRepository.transaction(async (query) => {
      return await this.saveParkingRecordWithTransaction(dto, query);
    });
  }

  private async validateParkingRecord(
    vehicle: VehicleEntity,
    dto: UpdateParkingRecordDTO,
    queryRunner?: QueryRunner,
  ) {
    const parkingRecord = await queryRunner.manager.findOne(
      ParkingRecordEntity,
      {
        where: { vehicle: { id: vehicle.id } },
        order: { id: 'DESC' },
      },
    );

    if (parkingRecord && parkingRecord.exitTime === null) {
      return this.parkingRecordService.updateIa.execute({
        id: parkingRecord.id,
        data: dto,
        queryRunner,
      });
    }
  }

  private async saveParkingRecordWithTransaction(
    dto: CreateParkingRecordDTO,
    query: QueryRunner,
  ) {
    const parkingRecord = await query.manager.save(
      ParkingRecordEntity,
      this.toAiEntryRecord(dto),
    );

    return parkingRecord;
  }

  private toAiEntryRecord(dto: CreateParkingRecordDTO) {
    return {
      ...dto,
      vehicle: dto.vehicle,
      entrySource: EParkingRecordSource.AI,
      entryReading: { id: dto.entryReadingId },
    };
  }
}
