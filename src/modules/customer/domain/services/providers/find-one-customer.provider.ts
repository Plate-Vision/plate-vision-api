import { HttpException } from '@nestjs/common';

import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { CustomerEntity } from '../../entities/customer.entity';
import { QueryRunner } from 'typeorm';
import { validate as isUUID } from 'uuid';

export class FindOneCustomerProvider {
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(data: { uuid: string }): Promise<CustomerEntity> {
    if (!isUUID(data.uuid)) {
      throw new HttpException('Cliente não encontrado', 404);
    }

    const customer = await this.customerRepository.manager.findOne({
      where: {
        uuid: data.uuid,
      },
      relations: ['userCreated', 'userUpdated'],
    });

    if (customer) return customer;

    throw new HttpException('Cliente não encontrado', 404);
  }

  public async executeById(data: {
    id: number;
    queryRunner?: QueryRunner;
  }): Promise<CustomerEntity> {
    let customer: CustomerEntity | null;

    if (data.queryRunner) {
      customer = await data.queryRunner.manager.findOne(CustomerEntity, {
        where: { id: data.id },
      });
    } else {
      customer = await this.customerRepository.manager.findOne({
        where: { id: data.id },
      });
    }

    if (customer) {
      return customer;
    }

    throw new HttpException('Cliente não encontrado', 404);
  }
}
