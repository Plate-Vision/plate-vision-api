import { validateParkingPeriod } from '../helpers/validate-parking-period';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { CreateParkingRecordDTO } from '../../dtos/create-parking-record.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { EParkingRecordSource } from '../../enums/parking-record-source.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { FindOneVehicleProvider } from '@modules/vehicle/domain/services/providers/find-one-vehicle.provider';
import { EVehicleStatus } from '@modules/vehicle/domain/enums/vehicle-status.enum';
import { FindOneParkingRecordProvider } from './find-one-parking-record.provider';

export class CreateParkingRecordManualProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly findOneVehicle: FindOneVehicleProvider,
    private readonly findOneParkingRecord: FindOneParkingRecordProvider,
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
    const vehicle = await this.findOneVehicle.executeById({
      id: dto.vehicle.id,
    });

    if (vehicle.status === EVehicleStatus.INACTIVE) {
      throw new HttpException('Veículo inativo', 422);
    }

    if (vehicle.isServiceVehicle === true) {
      throw new HttpException(
        'Não é possível registrar entrada ou saída de um veículo de serviço',
        422,
      );
    }

    validateParkingPeriod(dto.entryTime, dto.exitTime);
    await this.validateParkingRecord(dto.vehicle);

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

  private async validateParkingRecord(vehicle: VehicleEntity) {
    const parkingRecord =
      await this.findOneParkingRecord.executeByLastOneVehicle(vehicle.id);

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
      this.toManualParkingRecord(dto, authUser),
    );

    return parkingRecord;
  }

  private toManualParkingRecord(
    dto: CreateParkingRecordDTO,
    authUser: UserEntity,
  ) {
    return {
      ...dto,
      vehicle: dto.vehicle,
      userCreated: authUser,
      entrySource: EParkingRecordSource.MA,
      exitSource: dto.exitTime ? EParkingRecordSource.MA : null,
    };
  }
}
