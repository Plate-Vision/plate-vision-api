import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository extends BaseRepository<CustomerEntity> {
  public constructor(
    @InjectRepository(CustomerEntity)
    repository: Repository<CustomerEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
