import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from './domain/entities/role.entity';
import { RoleService } from './services/role.service';
import { AbilityEntity } from './domain/entities/ability.entity';
import { AbilityService } from './services/ability.service';
import { RoleRepository } from './domain/repositories/role.repository';
import { RoleControllers } from './controllers/role.controller';
import { RoleAbilityEntity } from './domain/entities/role-ability.entity';
import { AbilityRepository } from './domain/repositories/ability.repository';
import { AbilityControllers } from './controllers/ability.controller';
import { RoleAbilityRepository } from './domain/repositories/role-ability.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, AbilityEntity, RoleAbilityEntity]),
  ],
  providers: [
    RoleRepository,
    AbilityRepository,
    RoleAbilityRepository,
    RoleService,
    AbilityService,
  ],
  controllers: [...RoleControllers, ...AbilityControllers],
  exports: [],
})
export class RoleModule {}
