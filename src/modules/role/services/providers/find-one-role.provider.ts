import { HttpException } from '@nestjs/common';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { RoleRepository } from '@modules/role/domain/repositories/role.repository';

export class FindOneRoleProvider {
  public constructor(private readonly roleRepository: RoleRepository) {}

  public async execute(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.manager.findOne({
      where: { id },
      relations: ['roleAbilities.ability'],
    });

    if (!role) throw new HttpException('Perfil não encontrado', 404);

    return role;
  }
}
