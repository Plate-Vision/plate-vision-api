import { HttpException } from '@nestjs/common';

import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { CustomerEntity } from '../../entities/customer.entity';

export class FindOneCustomerProvider {
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(data: { id: number }): Promise<CustomerEntity> {
    const customer = await this.customerRepository.manager.findOne({
      where: {
        id: data.id,
      },
      relations: ['userCreated', 'userUpdated'],
    });

    if (customer) return customer;

    throw new HttpException('Cliente não encontrado', 404);
  }
}
