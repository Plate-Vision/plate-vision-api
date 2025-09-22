import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlateReadingEntity } from './domain/entities/plate-reading.entity';
import { PlateReadingRepository } from './infra/repositories/plate-reading.repository';
import { TaskProvider } from './domain/services/providers/task.provider';
import { PlateReadingService } from './domain/services/plate-reading.service';
import { PlateReadingControllers } from './application/controllers/plate-reading.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlateReadingEntity])],
  providers: [PlateReadingRepository, TaskProvider, PlateReadingService],
  controllers: [...PlateReadingControllers],
  exports: [PlateReadingRepository],
})
export class PlateReadingModule {}
