import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { CreateOccurrenceDTO } from '../../dtos/create-occurrence.dto';
import { OccurrenceEntity } from '../../entities/occurrence.entity';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { EVehicleStatus } from '@modules/vehicle/domain/enums/vehicle-status.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';

export class CreateOccurrenceProvider {
  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
    private readonly vehicleService: VehicleService,
  ) {}

  public async execute({
    dto,
    authUser,
    queryRunner,
  }: {
    dto: CreateOccurrenceDTO;
    authUser: UserEntity;
    queryRunner?: QueryRunner;
  }): Promise<OccurrenceEntity> {
    const vehicle = await this.vehicleService.findOne.executeById({
      id: dto.vehicleId,
    });

    if (vehicle.status === EVehicleStatus.INACTIVE) {
      throw new HttpException(
        'Não é possível vincular uma ocorrência a um veículo inativo',
        412,
      );
    }

    if (queryRunner) {
      return await this.saveVehicleWithTransaction(dto, authUser, queryRunner);
    }

    return await this.occurrenceRepository.transaction(async (query) => {
      return await this.saveVehicleWithTransaction(dto, authUser, query);
    });
  }

  private async saveVehicleWithTransaction(
    dto: CreateOccurrenceDTO,
    authUser: UserEntity,
    query: QueryRunner,
  ) {
    const occurrence = await query.manager.save(
      OccurrenceEntity,
      await this.serialize(dto, authUser),
    );

    return occurrence;
  }

  private async serialize(dto: CreateOccurrenceDTO, authUser: UserEntity) {
    const serializedData: Partial<OccurrenceEntity> = {
      ...dto,
      userCreated: authUser,
      vehicle: { id: dto.vehicleId } as VehicleEntity,
    };

    return serializedData;
  }
}
