import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { PlateReadingEntity } from '@modules/plate-reading/domain/entities/plate-reading.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlateReadingRepository extends BaseRepository<PlateReadingEntity> {
  public constructor(
    @InjectRepository(PlateReadingEntity)
    repository: Repository<PlateReadingEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
