import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { ParkingRecordEntity } from '@modules/parking-record/domain/entities/parking-record.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ParkingRecordRepository extends BaseRepository<ParkingRecordEntity> {
  public constructor(
    @InjectRepository(ParkingRecordEntity)
    repository: Repository<ParkingRecordEntity>,
    env: EnvironmentVariablesProvider,
  ) {
    super(repository, env);
  }
}
