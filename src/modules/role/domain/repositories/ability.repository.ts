import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';

import { AbilityEntity } from '../entities/ability.entity';

@Injectable()
export class AbilityRepository extends BaseRepository<AbilityEntity> {
  public constructor(
    @InjectRepository(AbilityEntity)
    repository: Repository<AbilityEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
