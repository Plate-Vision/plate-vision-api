import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { CreateOccurrenceDTO } from '../../dtos/create-occurrence.dto';
import { OccurrenceEntity } from '../../entities/occurrence.entity';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { EVehicleStatus } from '@modules/vehicle/domain/enums/vehicle-status.enum';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { OccurrenceService } from '../occurrence.service';

export class CreateOccurrenceProvider {
  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
    private readonly vehicleService: VehicleService,
    private readonly occurrenceService: OccurrenceService,
  ) {}

  public async execute({
    dto,
    authUser,
    queryRunner,
    file,
  }: {
    dto: CreateOccurrenceDTO;
    authUser: UserEntity;
    queryRunner?: QueryRunner;
    file?: Express.Multer.File;
  }): Promise<OccurrenceEntity> {
    if (dto.vehicle.status === EVehicleStatus.INACTIVE) {
      throw new HttpException(
        'Não é possível vincular uma ocorrência a um veículo inativo',
        412,
      );
    }

    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.occurrenceService.createImage.execute(file);

      if (!imageUrl) {
        throw new HttpException('Falha ao processar a imagem', 500);
      }
    }

    if (queryRunner) {
      return await this.saveVehicleWithTransaction(
        dto,
        authUser,
        queryRunner,
        imageUrl,
      );
    }

    return await this.occurrenceRepository.transaction(async (query) => {
      return await this.saveVehicleWithTransaction(
        dto,
        authUser,
        query,
        imageUrl,
      );
    });
  }

  private async saveVehicleWithTransaction(
    dto: CreateOccurrenceDTO,
    authUser: UserEntity,
    query: QueryRunner,
    imageUrl?: string,
  ) {
    const occurrence = await query.manager.save(
      OccurrenceEntity,
      await this.serialize(dto, authUser, imageUrl),
    );

    return occurrence;
  }

  private async serialize(
    dto: CreateOccurrenceDTO,
    authUser: UserEntity,
    imageUrl?: string,
  ) {
    const serializedData: Partial<OccurrenceEntity> = {
      ...dto,
      userCreated: authUser,
      vehicle: dto.vehicle,
    };

    if (imageUrl) {
      serializedData.urlImage = imageUrl;
    }

    return serializedData;
  }
}
