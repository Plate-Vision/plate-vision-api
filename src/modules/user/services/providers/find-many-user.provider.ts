import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

import { FindManyUserDTO } from '@modules/user/domain/dtos/find-many-user.dto';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

export class FindManyUserProvider {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(params: { dto: FindManyUserDTO; authUser: UserEntity }) {
    let where: Array<FindOptionsWhere<UserEntity>> = [{}];
    const order: FindOptionsOrder<UserEntity> = {};

    if (params.dto.roleId) {
      where[0].role = { id: params.dto.roleId };
    }

    if (params.dto.status) {
      where[0].status = params.dto.status;
    }

    if (params.dto.search) {
      where = [
        { ...where[0], name: ILike(`%${params.dto.search}%`) },
        { ...where[0], email: ILike(`%${params.dto.search}%`) },
      ];
    }

    if (params.dto.orderBy) {
      order[params.dto.orderBy] = params.dto.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = params.dto;

    const [data, total] = await this.userRepository.manager.findAndCount({
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
