import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParkingRecordEntity } from './domain/entities/parking-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingRecordEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class ParkingRecordModule {}
