import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { AbilityRepository } from '@modules/role/domain/repositories/ability.repository';
import { FindManyAbilityDTO } from '@modules/role/domain/dtos/find-many-ability.dto';

export class FindManyAbilityProvider {
  public constructor(private readonly abilityRepository: AbilityRepository) {}

  public async execute(params: FindManyAbilityDTO) {
    const where: FindOptionsWhere<AbilityEntity> = {};
    const order: FindOptionsOrder<AbilityEntity> = {};

    if (params.search) {
      where.name = ILike(`%${params.search}%`);
    }

    if (params.reference) {
      where.reference = params.reference;
    }

    if (params.orderBy) {
      order[params.orderBy] = params.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = params;

    const [data, total] = await this.abilityRepository.manager.findAndCount({
      where,
      order,
      take,
      skip,
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    return {
      data,
      total,
      pages,
    };
  }
}
