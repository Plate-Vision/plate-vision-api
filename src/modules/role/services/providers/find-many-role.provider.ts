import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { RoleRepository } from '@modules/role/domain/repositories/role.repository';
import { FindManyRoleDTO } from '@modules/role/domain/dtos/find-many-role.dto';

export class FindManyRoleProvider {
  public constructor(private readonly roleRepository: RoleRepository) {}

  public async execute(params: FindManyRoleDTO) {
    const where: FindOptionsWhere<RoleEntity> = {};
    const order: FindOptionsOrder<RoleEntity> = {};

    if (params.search) {
      where.name = ILike(`%${params.search}%`);
    }

    if (params.reference) {
      where.reference = params.reference;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.orderBy) {
      order[params.orderBy] = params.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = params;

    const [data, total] = await this.roleRepository.manager.findAndCount({
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
