import { HttpException } from '@nestjs/common';

import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

export class FindOneUserProvider {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(data: {
    id: number;
    authUser: UserEntity;
  }): Promise<UserEntity> {
    const user = await this.userRepository.manager.findOne({
      where: {
        id: data.id,
      },
      relations: ['role'],
    });

    if (user) return user;

    throw new HttpException('Usuário não encontrado', 404);
  }
}
