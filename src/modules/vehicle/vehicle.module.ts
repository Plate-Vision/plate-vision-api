import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerModule } from '../customer/customer.module';
import { VehicleEntity } from './domain/entities/vehicle.entity';
import { VehicleRepository } from './infra/repositories/vehicle.repository';
import { VehicleService } from './domain/services/vehicle.service';
import { VehicleControllers } from './application/controllers/vehicle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity]), CustomerModule],
  providers: [VehicleRepository, VehicleService],
  controllers: [...VehicleControllers],
  exports: [VehicleRepository],
})
export class VehicleModule {}
