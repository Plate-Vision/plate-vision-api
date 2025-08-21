import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { CreateAbilityDTO } from '@modules/role/domain/dtos/create-ability.dto';
import { AbilityRepository } from '@modules/role/domain/repositories/ability.repository';

export class CreateAbilityProvider {
  public constructor(private readonly abilityRepository: AbilityRepository) {}

  public async execute(dto: CreateAbilityDTO) {
    try {
      const alreadyExists = await this.abilityRepository.manager.findOne({
        where: { reference: dto.reference },
      });

      if (alreadyExists)
        throw new HttpException(
          'Esta habilidade já foi cadastrada no sistema',
          403,
        );

      const data = plainToInstance(AbilityEntity, dto);

      return await this.abilityRepository.manager.save(data);
    } catch (error) {
      const { message } = error as Error;
      throw new HttpException(message, 400);
    }
  }
}
