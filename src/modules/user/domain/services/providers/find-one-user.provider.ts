import { HttpException } from '@nestjs/common';

import { UserRepository } from '@modules/user/infra/repositories/user.repository';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

export class FindOneUserProvider {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(data: {
    uuid: string;
    authUser: UserEntity;
  }): Promise<UserEntity> {
    const user = await this.userRepository.manager.findOne({
      where: {
        uuid: data.uuid,
      },
      relations: ['role'],
    });

    if (user) return user;

    throw new HttpException('Usuário não encontrado', 404);
  }
}
