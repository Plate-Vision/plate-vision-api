import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';
import { PasswordHelper } from '@modules/user/domain/helpers/password.helper';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordResetDTO } from '@modules/auth/domain/dtos/password-reset.dto';

import { TokenProvider } from './token.provider';

export class PasswordResetProvider {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly token: TokenProvider,
  ) {}

  public async execute({
    token,
    password,
  }: PasswordResetDTO): Promise<MessagePayload> {
    const { id } = await this.token.verify(token);

    await this.resetPassword(id, password);

    return { message: 'Senha redefinida com sucesso' };
  }

  private async resetPassword(id: number, pass: string) {
    const user = await this.userRepository.manager.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    user.password = await PasswordHelper.hash(pass);
    user.resetPassword = false;

    return await this.userRepository.manager.update(id, user);
  }
}
