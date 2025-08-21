import { QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { UpdateUserDTO } from '@modules/user/domain/dtos/update-user.dto';
import { PasswordHelper } from '@modules/user/domain/helpers/password.helper';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';

export class UpdateUserProvider {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(data: {
    id: number;
    data: UpdateUserDTO;
    authUser: UserEntity;
  }): Promise<UserEntity> {
    const user = await this.findUser(data.id);

    await this.validateUserEmail(data.data.email, user);

    return await this.userRepository.transaction(async (query) => {
      const role = await this.findRoleWithTransaction(data.data.roleId, query);

      const updatedUser = await query.manager.save(
        await this.serializeUserData(user, data.data, role),
      );

      delete updatedUser.password;

      return updatedUser;
    });
  }

  private async findUser(id: number) {
    const foundUser = await this.userRepository.manager.findOne({
      where: {
        id,
      },
      relations: [],
    });

    if (!foundUser) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    return foundUser;
  }

  private async findRoleWithTransaction(roleId: number, query: QueryRunner) {
    const role = await query.manager.findOne(RoleEntity, {
      where: { id: roleId },
    });

    if (role) return role;

    throw new HttpException('Perfil do usuário não encontrado', 404);
  }

  private async validateUserEmail(email: string, user: UserEntity) {
    const userWithEmail = await this.userRepository.manager.findOne({
      where: { email },
    });

    if (userWithEmail && userWithEmail.id != user.id) {
      throw new HttpException(
        'Este email já está sendo utilizado por outro usuário',
        403,
      );
    }
  }

  private async serializeUserData(
    user: UserEntity,
    data: UpdateUserDTO,
    role: RoleEntity,
  ) {
    if (data.password) {
      data.password = PasswordHelper.hashSync(data.password);
    }

    return plainToInstance(
      UserEntity,
      { ...user, ...data, role },
      { ignoreDecorators: true },
    );
  }
}
