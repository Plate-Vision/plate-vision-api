import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { RoleRepository } from '@modules/role/domain/repositories/role.repository';
import { RoleAbilityEntity } from '@modules/role/domain/entities/role-ability.entity';

export class DeleteRoleProvider {
  public constructor(private readonly roleRepository: RoleRepository) {}

  public async execute(id: number): Promise<MessagePayload> {
    await this.validate(id);

    await this.roleRepository.transaction(async (queryRunner) => {
      await Promise.all([
        queryRunner.manager.delete(RoleAbilityEntity, { role: { id } }),
        queryRunner.manager.softDelete(RoleEntity, { id }),
      ]);
    });

    return { message: 'Perfil de usuário excluído com sucesso' };
  }

  private async validate(id: number): Promise<void> {
    const roleFound = await this.roleRepository.manager.findOne({
      select: {
        id: true,
        users: true,
      },
      where: {
        id,
      },
      relations: ['users'],
    });

    if (!roleFound)
      throw new HttpException('Perfil de usuário não encontrado', 404);

    if (roleFound.users && roleFound.users.length)
      throw new HttpException('Perfil de usuário em uso', 422);
  }
}
