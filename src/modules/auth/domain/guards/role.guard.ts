import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RoleGuard implements CanActivate {
  public constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.getAllAndOverride<any[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = request.user as UserEntity;

    if (!requiredRoles || !requiredRoles.length) {
      return true;
    }

    const hasRequiredRole = requiredRoles.some(
      (role) => user.role.reference === role,
    );

    if (!hasRequiredRole) {
      throw new HttpException(
        'Usuário não possui o perfil necessário para acessar esta rota',
        403,
      );
    }

    return hasRequiredRole;
  }
}
