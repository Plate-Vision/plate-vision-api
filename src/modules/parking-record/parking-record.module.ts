import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParkingRecordEntity } from './domain/entities/parking-record.entity';
import { ParkingRecordRepository } from './infra/repositories/parking-record.repository';
import { ParkingRecordService } from './domain/services/parking-record.service';
import { ParkingRecordControllers } from './application/controllers/parking-record.controller';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingRecordEntity, VehicleEntity])],
  providers: [ParkingRecordRepository, ParkingRecordService, VehicleRepository],
  controllers: [...ParkingRecordControllers],
  exports: [ParkingRecordRepository],
})
export class ParkingRecordModule {}
