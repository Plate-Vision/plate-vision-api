import { Injectable } from '@nestjs/common';

import { AbilityRepository } from '../domain/repositories/ability.repository';
import { RoleAbilityRepository } from '../domain/repositories/role-ability.repository';

import { CreateAbilityProvider } from './providers/create-ability.provider';
import { UpdateAbilityProvider } from './providers/update-ability.provider';
import { DeleteAbilityProvider } from './providers/delete-ability.provider';
import { FindOneAbilityProvider } from './providers/find-one-ability.provider';
import { FindManyAbilityProvider } from './providers/find-many-ability.provider';

@Injectable()
export class AbilityService {
  public findMany: FindManyAbilityProvider;
  public findOne: FindOneAbilityProvider;
  public create: CreateAbilityProvider;
  public update: UpdateAbilityProvider;
  public delete: DeleteAbilityProvider;

  public constructor(
    private readonly abilityRepository: AbilityRepository,
    private readonly roleAbilityRepository: RoleAbilityRepository,
  ) {
    this.findMany = new FindManyAbilityProvider(this.abilityRepository);
    this.findOne = new FindOneAbilityProvider(this.abilityRepository);
    this.create = new CreateAbilityProvider(this.abilityRepository);
    this.update = new UpdateAbilityProvider(this.abilityRepository);

    this.delete = new DeleteAbilityProvider(
      this.abilityRepository,
      this.roleAbilityRepository,
    );
  }
}
