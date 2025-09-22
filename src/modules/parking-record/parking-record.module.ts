import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParkingRecordEntity } from './domain/entities/parking-record.entity';
import { ParkingRecordRepository } from './infra/repositories/parking-record.repository';
import { ParkingRecordService } from './domain/services/parking-record.service';
import { ParkingRecordControllers } from './application/controllers/parking-record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingRecordEntity])],
  providers: [ParkingRecordRepository, ParkingRecordService],
  controllers: [...ParkingRecordControllers],
  exports: [ParkingRecordRepository],
})
export class ParkingRecordModule {}
