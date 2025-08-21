import { HttpException, NotImplementedException } from '@nestjs/common';

import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { MessagePayload } from '@shared/payloads/message.payload';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

import { TokenProvider } from './token.provider';

export class PasswordRecoveryProvider {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly token: TokenProvider,
  ) {}

  public async execute(email: string): Promise<MessagePayload> {
    const user = await this.findUser(email);

    const { token } = await this.token.execute({
      id: user.id,
      email: user.email,
    });

    await this.sendEmail(user, token);

    return {
      message: 'Email de recuperação de senha enviado com sucesso',
    };
  }

  private async findUser(email: string) {
    const userWithEmail = await this.userRepository.manager.findOne({
      where: { email },
    });

    if (!userWithEmail) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    return userWithEmail;
  }

  private async sendEmail(user: UserEntity, token: string) {
    throw new NotImplementedException('Email não implementado');
  }
}
