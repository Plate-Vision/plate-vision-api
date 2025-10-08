import { HttpException } from '@nestjs/common';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { RoleRepository } from '@modules/role/infra/repositories/role.repository';

export class FindOneRoleProvider {
  public constructor(private readonly roleRepository: RoleRepository) {}

  public async execute(uuid: string): Promise<RoleEntity> {
    const role = await this.roleRepository.manager.findOne({
      where: { uuid },
      relations: ['roleAbilities.ability'],
    });

    if (!role) throw new HttpException('Perfil não encontrado', 404);

    return role;
  }
}
