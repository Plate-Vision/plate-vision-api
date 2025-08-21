import { HttpException } from '@nestjs/common';

import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { AbilityRepository } from '@modules/role/domain/repositories/ability.repository';

export class FindOneAbilityProvider {
  public constructor(private readonly abilityRepository: AbilityRepository) {}

  public async execute(id: number): Promise<AbilityEntity> {
    const ability = await this.abilityRepository.manager.findOne({
      where: { id },
    });

    if (!ability) throw new HttpException('Habilidade não encontrada', 404);

    return ability;
  }
}
