import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/infra/repositories/user.repository';

export class DeleteUserProvider {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(data: {
    uuid: string;
    authUser: UserEntity;
  }): Promise<MessagePayload> {
    if (data.authUser.uuid == data.uuid) {
      throw new HttpException(
        'Não é possível realizar a deleção do próprio usuário',
        409,
      );
    }

    const user = await this.findUser(data.uuid);

    await this.userRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(UserEntity, { uuid: user.uuid });
    });

    return { message: 'Usuário deletado com sucesso' };
  }

  private async findUser(uuid: string) {
    const user = await this.userRepository.manager.findOne({
      where: {
        uuid,
      },
      relations: [],
    });

    if (user) {
      return user;
    }

    throw new HttpException('Usuário não encontrado', 404);
  }
}
