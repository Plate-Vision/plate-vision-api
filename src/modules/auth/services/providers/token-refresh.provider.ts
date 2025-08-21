import { HttpException } from '@nestjs/common';

import { AuthPayload } from '@modules/auth/domain/payloads/auth.payload';
import { EUserStatus } from '@modules/user/domain/enums/user-status.enum';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { RefreshTokenDTO } from '@modules/auth/domain/dtos/refresh-token.dto';

import { TokenProvider } from './token.provider';

export class TokenRefreshProvider {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly token: TokenProvider,
  ) {}

  public async execute(dto: RefreshTokenDTO): Promise<AuthPayload> {
    const { id, email } = await this.token.verify(dto.refresh);

    await this.validateUser(email);

    return await this.token.execute({
      id,
      email,
    });
  }

  private async validateUser(email: string): Promise<void> {
    const user = await this.userRepository.manager.findOne({
      select: {
        status: true,
      },
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    if (user.status !== EUserStatus.ACTIVE) {
      throw new HttpException(
        'Usuário inativo, entre em contato com o administrador do sistema',
        403,
      );
    }
  }
}
