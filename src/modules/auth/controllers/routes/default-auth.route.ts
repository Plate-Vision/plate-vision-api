import { Body } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { LoginDTO } from '@modules/auth/domain/dtos/login.dto';
import { AuthService } from '@modules/auth/services/auth.service';
import { AuthPayload } from '@modules/auth/domain/payloads/auth.payload';
import { MessagePayload } from '@shared/payloads/message.payload';
import { RefreshTokenDTO } from '@modules/auth/domain/dtos/refresh-token.dto';
import { PasswordResetDTO } from '@modules/auth/domain/dtos/password-reset.dto';
import { PasswordRecoveryDTO } from '@modules/auth/domain/dtos/password-recovery.dto';

import { AuthController } from '../decorators/auth-controller.decorator';

@AuthController.default()
export class DefaultAuthController {
  public constructor(private readonly service: AuthService) {}

  @Endpoint.post({
    url: '/login',
    description: 'Realizar login com um usuário válido na plataforma',
    dtoName: 'LoginDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        status: 200,
        description: 'Usuário logado com com sucesso',
        response: AuthPayload,
      },
      {
        status: 404,
        description: 'Email e/ou senha do usuário inválida(os)',
      },
    ],
  })
  public async login(@Body() dto: LoginDTO) {
    return await this.service.login.execute(dto);
  }

  @Endpoint.post({
    url: '/refresh',
    description: 'Cria novos tokens com base no refresh token',
    dtoName: 'RefreshTokenDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        status: 200,
        description: 'Dados do token',
        response: AuthPayload,
      },
      {
        status: 401,
        description: 'Token inválido',
      },
      {
        status: 404,
        description: 'Usuário não encontrado',
      },
      {
        status: 403,
        description:
          'Usuário inativo, entre em contato com o administrador do sistema',
      },
    ],
  })
  public async refresh(@Body() dto: RefreshTokenDTO) {
    return await this.service.tokenRefresh.execute(dto);
  }

  @Endpoint.post({
    url: 'password/recovery',
    description:
      'Solicitar a recuperação de senha de um usuário, enviando um email para tal',
    dtoName: 'PasswordRecoveryDTO',
    roles: [],
    actions: [],
    abilities: [],
    withoutLogin: true,
    responses: [
      {
        description: 'Email de recuperação de senha enviado com sucesso',
        status: 200,
        response: MessagePayload,
      },
      {
        description: 'Email de usuário não encontrado',
        status: 404,
      },
      {
        description: 'Ocorreu um erro ao enviar o email',
        status: 503,
      },
    ],
  })
  public async passwordRecovery(@Body() dto: PasswordRecoveryDTO) {
    return await this.service.passwordRecovery.execute(dto.email);
  }

  @Endpoint.patch({
    url: 'password/reset',
    description: 'Redefinir senha de usuário',
    dtoName: 'PasswordResetDTO',
    roles: [],
    actions: [],
    abilities: [],
    withoutLogin: true,
    responses: [
      {
        description: 'Senha redefinida com sucesso',
        status: 200,
        response: MessagePayload,
      },
      {
        description: 'Token inválido',
        status: 403,
      },
      {
        description: 'Usuário não encontrado',
        status: 404,
      },
    ],
  })
  public async updatePassword(@Body() data: PasswordResetDTO) {
    return await this.service.passwordReset.execute(data);
  }
}
