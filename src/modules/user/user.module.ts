import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserControllers } from './controllers/user.controller';
import { UserRepository } from './domain/repositories/user.repository';
import { UserService } from './services/user.service';
import { UserEntity } from './domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository, UserService],
  controllers: [...UserControllers],
  exports: [UserRepository],
})
export class UserModule {}
