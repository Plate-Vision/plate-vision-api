import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { ParkingRecordEntity } from '../../entities/parking-record.entity';
import { CreateParkingRecordDTO } from '../../dtos/create-parking-record.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { QueryRunner } from 'typeorm';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { HttpException } from '@nestjs/common';
import { EParkingRecordSource } from '../../enums/parking-record-source.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';

export class CreateParkingRecordManualProvider {
  public constructor(
    private readonly parkingRecordRepository: ParkingRecordRepository,
    private readonly vehicleRepository: VehicleRepository,
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
    await this.validateVehicle(dto.vehicleId);
    await this.validateParkingRecord(dto.vehicleId);

    if (queryRunner) {
      return await this.saveParkingRecordWithTransaction(
        dto,
        authUser,
        queryRunner,
      );
    }

    return await this.vehicleRepository.transaction(async (query) => {
      return await this.saveParkingRecordWithTransaction(dto, authUser, query);
    });
  }

  private async validateVehicle(id: number) {
    const vehicle = await this.vehicleRepository.manager.findOne({
      where: { id },
    });

    if (!vehicle) throw new HttpException('Veículo não encontrado', 412);
  }

  private async validateParkingRecord(id: number) {
    const parkingRecord = await this.parkingRecordRepository.manager.findOne({
      where: { vehicle: { id } },
      order: { id: 'DESC' },
    });

    if (parkingRecord) {
      if (parkingRecord.exitTime === null) {
        throw new HttpException(
          'Já existe um registro para esse veículo sem data e hora de saída',
          422,
        );
      }
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
    const serializedData: Partial<ParkingRecordEntity> = {
      ...dto,
      vehicle: { id: dto.vehicleId } as VehicleEntity,
      userCreated: authUser,
      entrySource: EParkingRecordSource.MA,
    };

    return serializedData;
  }
}
