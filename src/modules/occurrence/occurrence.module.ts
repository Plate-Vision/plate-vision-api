import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OccurrenceEntity } from './domain/entities/occurrence.entity';
import { OccurrenceService } from './domain/services/occurrence.service';
import { OccurrenceRepository } from './infra/repositories/occurrence.repository';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { OccurrenceControllers } from './application/controllers/occurrence.controller';
import { CloudinaryProvider } from './domain/services/providers/cloudinary.provider';

@Module({
  imports: [TypeOrmModule.forFeature([OccurrenceEntity]), VehicleModule],
  providers: [OccurrenceRepository, OccurrenceService, CloudinaryProvider],
  controllers: [...OccurrenceControllers],
  exports: [OccurrenceRepository, OccurrenceService],
})
export class OccurrenceModule {}
