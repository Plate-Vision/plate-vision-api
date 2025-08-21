import { Injectable } from '@nestjs/common';

import { RoleRepository } from '../domain/repositories/role.repository';
import { AbilityRepository } from '../domain/repositories/ability.repository';

import { CreateRoleProvider } from './providers/create-role.provider';
import { UpdateRoleProvider } from './providers/update-role.provider';
import { DeleteRoleProvider } from './providers/delete-role.provider';
import { FindOneRoleProvider } from './providers/find-one-role.provider';
import { FindManyRoleProvider } from './providers/find-many-role.provider';

@Injectable()
export class RoleService {
  public create: CreateRoleProvider;
  public update: UpdateRoleProvider;
  public findMany: FindManyRoleProvider;
  public findOne: FindOneRoleProvider;
  public delete: DeleteRoleProvider;

  public constructor(
    private readonly roleRepository: RoleRepository,
    private readonly abilityRepository: AbilityRepository,
  ) {
    this.findMany = new FindManyRoleProvider(this.roleRepository);
    this.findOne = new FindOneRoleProvider(this.roleRepository);
    this.delete = new DeleteRoleProvider(this.roleRepository);

    this.create = new CreateRoleProvider(
      this.roleRepository,
      this.abilityRepository,
    );

    this.update = new UpdateRoleProvider(
      this.roleRepository,
      this.abilityRepository,
    );
  }
}
