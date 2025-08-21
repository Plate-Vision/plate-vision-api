import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { UpdateAbilityDTO } from '@modules/role/domain/dtos/update-ability.dto';
import { AbilityRepository } from '@modules/role/domain/repositories/ability.repository';

export class UpdateAbilityProvider {
  constructor(private readonly abilityRepository: AbilityRepository) {}

  public async execute(
    id: number,
    dto: UpdateAbilityDTO,
  ): Promise<AbilityEntity> {
    const ability = await this.abilityRepository.manager.findOne({
      where: { id },
    });

    if (!ability) throw new HttpException('Habilidade não encontrada', 404);

    await this.abilityRepository.manager.update(id, { name: dto.name });

    return plainToInstance(AbilityEntity, {
      ...ability,
      name: dto.name,
    });
  }
}
