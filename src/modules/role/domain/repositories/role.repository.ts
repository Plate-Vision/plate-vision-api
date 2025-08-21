import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';

import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<RoleEntity> {
  public constructor(
    @InjectRepository(RoleEntity)
    repository: Repository<RoleEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
