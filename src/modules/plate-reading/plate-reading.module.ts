import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlateReadingEntity } from './domain/entities/plate-reading.entity';
import { PlateReadingRepository } from './infra/repositories/plate-reading.repository';
import { TaskProvider } from './domain/services/providers/task.provider';

@Module({
  imports: [TypeOrmModule.forFeature([PlateReadingEntity])],
  providers: [PlateReadingRepository, TaskProvider],
  controllers: [],
  exports: [],
})
export class PlateReadingModule {}
