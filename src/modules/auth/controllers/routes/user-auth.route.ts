import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { AuthController } from '../decorators/auth-controller.decorator';

@AuthController.user()
export class UserAuthController {
  @Endpoint.get({
    url: '/',
    description: 'Buscar dados do usuário logado',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        status: 200,
        description: 'Dados do usuário logado',
      },
    ],
  })
  public getUser(@AuthUser() user: UserEntity) {
    return user;
  }
}
