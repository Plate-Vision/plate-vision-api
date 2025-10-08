import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from './domain/entities/role.entity';
import { AbilityEntity } from './domain/entities/ability.entity';
import { RoleControllers } from './application/controllers/role.controller';
import { RoleAbilityEntity } from './domain/entities/role-ability.entity';
import { AbilityControllers } from './application/controllers/ability.controller';
import { RoleRepository } from './infra/repositories/role.repository';
import { AbilityRepository } from './infra/repositories/ability.repository';
import { RoleAbilityRepository } from './infra/repositories/role-ability.repository';
import { RoleService } from './domain/services/role.service';
import { AbilityService } from './domain/services/ability.service';

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
