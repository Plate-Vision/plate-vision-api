import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { FindManyOccurrenceDTO } from '../../dtos/find-many-occurrence.dto';
import { OccurrenceEntity } from '../../entities/occurrence.entity';
import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';

export class FindManyOccurrenceProvider {
  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
  ) {}

  public async execute(params: { dto: FindManyOccurrenceDTO }) {
    let where: Array<FindOptionsWhere<OccurrenceEntity>> = [{}];
    const order: FindOptionsOrder<OccurrenceEntity> = {};

    if (params.dto.status) {
      where[0].status = params.dto.status;
    }

    if (params.dto.search) {
      where = [{ ...where[0], description: ILike(`%${params.dto.search}%`) }];
    }

    if (params.dto.orderBy) {
      order[params.dto.orderBy] = params.dto.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = params.dto;

    const [data, total] = await this.occurrenceRepository.manager.findAndCount({
      where,
      order,
      relations: { vehicle: true },
      take,
      skip,
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    if (!data.length) {
      return {
        data,
        total,
        pages,
        message: 'Nenhuma ocorrência encontrada pelo filtro selecionado',
      };
    }

    return {
      data,
      total,
      pages,
    };
  }
}
