import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';

import { RoleAbilityEntity } from '../entities/role-ability.entity';

@Injectable()
export class RoleAbilityRepository extends BaseRepository<RoleAbilityEntity> {
  public constructor(
    @InjectRepository(RoleAbilityEntity)
    repository: Repository<RoleAbilityEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
