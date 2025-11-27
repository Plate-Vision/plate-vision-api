import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { RoleAbilityEntity } from '@modules/role/domain/entities/role-ability.entity';
import { RoleRepository } from '@modules/role/infra/repositories/role.repository';

export class DeleteRoleProvider {
  public constructor(private readonly roleRepository: RoleRepository) { }

  public async execute(uuid: string): Promise<MessagePayload> {
    const role = await this.validate(uuid);

    await this.roleRepository.transaction(async (queryRunner) => {
      await Promise.all([
        queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(RoleAbilityEntity)
          .where('role_id = :roleId', { roleId: role.id })
          .execute(),
        queryRunner.manager.softDelete(RoleEntity, { uuid }),
      ]);
    });

    return { message: 'Perfil de usuário excluído com sucesso' };
  }

  private async validate(uuid: string): Promise<RoleEntity> {
    const roleFound = await this.roleRepository.manager.findOne({
      select: {
        id: true,
        uuid: true,
      },
      where: {
        uuid,
      },
    });

    if (!roleFound)
      throw new HttpException('Perfil de usuário não encontrado', 404);

    if (roleFound.users && roleFound.users.length)
      throw new HttpException('Perfil de usuário em uso', 422);
    return roleFound;
  }
}
