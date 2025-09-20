import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlateReadingEntity } from './domain/entities/plate-reading.entity';
import { PlateReadingRepository } from './infra/repositories/plate-reading.repository';
import { TaskProvider } from './domain/services/providers/task.provider';
import { PlateReadingService } from './domain/services/plate-reading.service';
import { FindManyPlateReadingProvider } from './domain/services/providers/find-many.plate-reading.provider';
import { PlateReadingControllers } from './application/controllers/plate-reading.controller';
import { UpdatePlateReadingProvider } from './domain/services/providers/update.plate-reading.provider';

@Module({
  imports: [TypeOrmModule.forFeature([PlateReadingEntity])],
  providers: [
    PlateReadingRepository,
    TaskProvider,
    FindManyPlateReadingProvider,
    UpdatePlateReadingProvider,
    PlateReadingService,
  ],
  controllers: [...PlateReadingControllers],
  exports: [PlateReadingRepository],
})
export class PlateReadingModule {}
