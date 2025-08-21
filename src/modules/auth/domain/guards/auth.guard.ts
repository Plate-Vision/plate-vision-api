import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { AuthService } from '@modules/auth/services/auth.service';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}
  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException(
        'Usuário precisa estar logado para acessar esta rota',
        401,
      );
    }
    await this.verifyTokenUser(token, request);

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyTokenUser(token: string, request: Request) {
    try {
      const payload = await this.authService.token.verify(token);

      const user = await this.findUserById(payload.id);

      request['user'] = user;
    } catch {
      throw new HttpException(
        'Usuário precisa estar logado para acessar esta rota',
        401,
      );
    }
  }

  private async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.manager.findOne({
      where: { id: id },
      relations: ['role', 'role.roleAbilities', 'role.roleAbilities.ability'],
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado em nosso sistema', 404);
    }

    return user;
  }
}
