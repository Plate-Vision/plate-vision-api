import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccurrenceEntity } from './domain/entities/occurrence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OccurrenceEntity])],
  providers: [],
  controllers: [],
  exports: [],
})
export class OccurrenceModule {}
