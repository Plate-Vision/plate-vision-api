import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';

export class DeleteUserProvider {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(data: {
    id: number;
    authUser: UserEntity;
  }): Promise<MessagePayload> {
    if (data.authUser.id == data.id) {
      throw new HttpException(
        'Não é possível realizar a deleção do próprio usuário',
        409,
      );
    }

    const user = await this.findUser(data.id);

    await this.userRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(UserEntity, { id: user.id });
    });

    return { message: 'Usuário deletado com sucesso' };
  }

  private async findUser(id: number) {
    const user = await this.userRepository.manager.findOne({
      where: {
        id,
      },
      relations: [],
    });

    if (user) {
      return user;
    }

    throw new HttpException('Usuário não encontrado', 404);
  }
}
