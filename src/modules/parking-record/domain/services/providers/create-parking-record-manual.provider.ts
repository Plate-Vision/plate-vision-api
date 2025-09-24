import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { CreateParkingRecordDTO } from '../../dtos/create-parking-record.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { EParkingRecordSource } from '../../enums/parking-record-source.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { EVehicleStatus } from '@modules/vehicle/domain/enums/vehicle-status.enum';

export class CreateParkingRecordManualProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly vehicleService: VehicleService,
  ) {}

  public async execute({
    dto,
    authUser,
    queryRunner,
  }: {
    dto: CreateParkingRecordDTO;
    authUser: UserEntity;
    queryRunner?: QueryRunner;
  }): Promise<ParkingRecordEntity> {
    const vehicle = await this.vehicleService.findOne.execute({
      id: dto.vehicleId,
    });

    if (vehicle.status === EVehicleStatus.INACTIVE) {
      throw new HttpException('Veículo inativo', 422);
    }

    await this.validateParkingRecord(dto.vehicleId);

    if (queryRunner) {
      return await this.saveParkingRecordWithTransaction(
        dto,
        authUser,
        queryRunner,
      );
    }

    return await this.parkingRecordRepository.transaction(async (query) => {
      return await this.saveParkingRecordWithTransaction(dto, authUser, query);
    });
  }

  private async validateParkingRecord(id: number) {
    const parkingRecord = await this.parkingRecordRepository.manager.findOne({
      where: { vehicle: { id } },
      order: { id: 'DESC' },
    });

    if (parkingRecord && parkingRecord.exitTime === null) {
      throw new HttpException(
        'Já existe um registro para esse veículo sem data e hora de saída',
        422,
      );
    }
  }

  private async saveParkingRecordWithTransaction(
    dto: CreateParkingRecordDTO,
    authUser: UserEntity,
    query: QueryRunner,
  ) {
    const parkingRecord = await query.manager.save(
      ParkingRecordEntity,
      await this.serialize(dto, authUser),
    );

    return parkingRecord;
  }

  private async serialize(dto: CreateParkingRecordDTO, authUser: UserEntity) {
    return {
      ...dto,
      vehicle: { id: dto.vehicleId } as VehicleEntity,
      userCreated: authUser,
      entrySource: EParkingRecordSource.MA,
    };
  }
}
