import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { RoleAbilityEntity } from '@modules/role/domain/entities/role-ability.entity';

export const ABILITIES_KEY = 'abilities';
export const ACTIONS_KEY = 'actions';

@Injectable()
export class AbilityGuard implements CanActivate {
  public constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    if (!user?.role?.roleAbilities) {
      throw new HttpException(
        'Usuário não possui perfil ou habilidade para acessar esta rota',
        403,
      );
    }

    const requiredAbilities = this.getRequired(context, ABILITIES_KEY);
    const requiredActions = this.getRequired(context, ACTIONS_KEY);

    if (!requiredAbilities?.length) {
      return true;
    }

    const hasAbilities = this.checkAbilities(user, requiredAbilities);

    if (!hasAbilities.length) {
      throw new HttpException(
        'Usuário não possui habilidade para acessar esta rota',
        403,
      );
    }

    const hasActions = this.checkActions(hasAbilities, requiredActions);

    if (!hasActions) {
      throw new HttpException(
        'Usuário não possui permissão para acessar esta rota',
        403,
      );
    }

    return true;
  }

  private getRequired(context: ExecutionContext, key: string): Array<string> {
    return (
      this.reflector.getAllAndOverride<Array<string>>(key, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }

  private checkAbilities(user: UserEntity, requiredAbilities: string[]) {
    return user.role.roleAbilities.filter((ability) =>
      requiredAbilities.includes(ability.ability.reference),
    );
  }

  private checkActions(
    abilities: RoleAbilityEntity[],
    requiredActions?: string[],
  ): boolean {
    if (!requiredActions?.length) {
      return true;
    }

    return requiredActions.some((action) =>
      abilities.some((ability) => this.verifyAction(ability, action)),
    );
  }

  private verifyAction(
    roleAbility: RoleAbilityEntity,
    action: string,
  ): boolean {
    switch (action) {
      case 'CREATE':
        return roleAbility.canCreate;
      case 'READ':
        return roleAbility.canRead;
      case 'UPDATE':
        return roleAbility.canUpdate;
      case 'DELETE':
        return roleAbility.canDelete;
      default:
        return false;
    }
  }
}
