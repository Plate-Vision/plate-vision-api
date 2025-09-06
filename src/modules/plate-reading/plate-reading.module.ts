import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlateReadingEntity } from './domain/entities/plate-reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlateReadingEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class PlateReadingModule {}
