import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  public constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
