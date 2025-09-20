import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { FindManyCustomerDTO } from '../../dtos/find-many-customer.dto';
import { CustomerEntity } from '../../entities/customer.entity';

export class FindManyCustomerProvider {
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(params: { dto: FindManyCustomerDTO }) {
    let where: Array<FindOptionsWhere<CustomerEntity>> = [{}];
    const order: FindOptionsOrder<CustomerEntity> = {};

    if (params.dto.type) {
      where[0].type = params.dto.type;
    }

    if (params.dto.status) {
      where[0].status = params.dto.status;
    }

    if (params.dto.name) {
      where[0].name = ILike(`%${params.dto.name}%`);
    }

    if (params.dto.document) {
      where[0].document = ILike(`%${params.dto.document}%`);
    }

    if (params.dto.orderBy) {
      order[params.dto.orderBy] = params.dto.ordering ?? 'ASC';
    } else {
      order.id = 'DESC';
    }

    const { take, skip } = params.dto;

    const [data, total] = await this.customerRepository.manager.findAndCount({
      where,
      order,
      take,
      skip,
    });

    const pages = total ? Math.round(total / (take || total)) : 0;

    if (!data.length) {
      return {
        data,
        total,
        pages,
        message: 'Nenhum cliente encontrado pelo filtro selecionado',
      };
    }

    return {
      data,
      total,
      pages,
    };
  }
}
