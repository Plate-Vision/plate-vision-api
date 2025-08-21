import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';

import { AbilityRepository } from '@modules/role/domain/repositories/ability.repository';
import { RoleAbilityRepository } from '@modules/role/domain/repositories/role-ability.repository';

export class DeleteAbilityProvider {
  constructor(
    private readonly abilityRepository: AbilityRepository,
    private readonly roleAbilityRepository: RoleAbilityRepository,
  ) {}

  public async execute(id: number): Promise<MessagePayload> {
    const role = await this.abilityRepository.manager.findOne({
      where: { id },
    });

    if (!role) throw new HttpException('Habilidade não encontrada', 404);

    const hasRoleAbilities = await this.roleAbilityRepository.manager.count({
      where: { ability: { id } },
    });

    if (hasRoleAbilities) throw new HttpException('Habilidade em uso', 422);

    await this.abilityRepository.manager.softDelete(id);

    return { message: 'Habilidade excluída com sucesso' };
  }
}
