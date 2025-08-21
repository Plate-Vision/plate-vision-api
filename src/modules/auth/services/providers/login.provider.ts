import { HttpException } from '@nestjs/common';

import { LoginDTO } from '@modules/auth/domain/dtos/login.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { EUserStatus } from '@modules/user/domain/enums/user-status.enum';
import { AuthPayload } from '@modules/auth/domain/payloads/auth.payload';
import { PasswordHelper } from '@modules/user/domain/helpers/password.helper';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';

import { TokenProvider } from './token.provider';

export class LoginProvider {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly token: TokenProvider,
  ) {}

  public async execute(dto: LoginDTO): Promise<AuthPayload> {
    const user = await this.findUser(dto.email);

    await this.comparePasswords(dto.password, user.password);

    if (user.status !== EUserStatus.ACTIVE) {
      throw new HttpException(
        'Usuário inativa, entre em contato com o administrador do sistema',
        403,
      );
    }

    const auth = await this.token.execute({
      id: user.id,
      email: user.email,
    });

    return { ...auth, resetPassword: user.resetPassword };
  }

  private async findUser(email: string): Promise<UserEntity> {
    const user = await this.userRepository.manager.findOne({
      select: {
        id: true,
        email: true,
        status: true,
        password: true,
        resetPassword: true,
      },
      where: {
        email,
      },
    });

    if (!user) {
      this.invalidCrendentials();
    }

    return user;
  }

  private async comparePasswords(
    dtoPassword: string,
    userPassword: string,
  ): Promise<void> {
    const passwordMatch = await PasswordHelper.compare(
      dtoPassword,
      userPassword,
    );

    if (!passwordMatch) {
      this.invalidCrendentials();
    }
  }

  private invalidCrendentials() {
    throw new HttpException('Email e/ou senha do usuário inválida(os)', 404);
  }
}
