import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleRepository extends BaseRepository<VehicleEntity> {
  public constructor(
    @InjectRepository(VehicleEntity)
    repository: Repository<VehicleEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
