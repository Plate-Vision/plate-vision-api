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
import { ParkingRecordService } from '../parking-record.service';

export class CreateParkingRecordManualProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly vehicleService: VehicleService,
    private readonly parkingRecordService: ParkingRecordService,
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
    const vehicle = await this.vehicleService.findOne.executeById({
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

    await this.validateDate(dto);
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
      await this.parkingRecordService.findOne.executeByLastOneVehicle(
        vehicle.id,
      );

    if (parkingRecord && parkingRecord.exitTime === null) {
      throw new HttpException(
        'Já existe um registro para esse veículo sem data e hora de saída',
        422,
      );
    }
  }

  private async validateDate(dto: CreateParkingRecordDTO) {
    if (dto.entryTime && dto.exitTime && dto.exitTime < dto.entryTime) {
      throw new HttpException(
        'A data e hora de saída não pode ser menor que a data e hora de entrada',
        412,
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
      vehicle: dto.vehicle,
      userCreated: authUser,
      entrySource: EParkingRecordSource.MA,
      exitSource: dto.exitTime ? EParkingRecordSource.MA : null,
    };
  }
}
