import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleEntity } from './domain/entities/vehicle.entity';
import { VehicleRepository } from './infra/repositories/vehicle.repository';
import { VehicleService } from './domain/services/vehicle.service';
import { VehicleControllers } from './application/controllers/vehicle.controller';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity, CustomerEntity])],
  providers: [VehicleRepository, VehicleService, CustomerRepository],
  controllers: [...VehicleControllers],
  exports: [VehicleRepository],
})
export class VehicleModule {}
