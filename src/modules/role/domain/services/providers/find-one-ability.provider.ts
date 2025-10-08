import { HttpException } from '@nestjs/common';

import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { AbilityRepository } from '@modules/role/infra/repositories/ability.repository';

export class FindOneAbilityProvider {
  public constructor(private readonly abilityRepository: AbilityRepository) {}

  public async execute(uuid: string): Promise<AbilityEntity> {
    const ability = await this.abilityRepository.manager.findOne({
      where: { uuid },
    });

    if (!ability) throw new HttpException('Habilidade não encontrada', 404);

    return ability;
  }
}
