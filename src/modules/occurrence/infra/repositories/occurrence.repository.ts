import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { OccurrenceEntity } from '@modules/occurrence/domain/entities/occurrence.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OccurrenceRepository extends BaseRepository<OccurrenceEntity> {
  public constructor(
    @InjectRepository(OccurrenceEntity)
    repository: Repository<OccurrenceEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
