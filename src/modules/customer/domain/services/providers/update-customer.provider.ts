import { ILike, QueryRunner } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { UpdateCustomerDTO } from '../../dtos/update-customer.dto';
import { ECustomerStatus } from '../../enums/customer-status.enum';
import { CustomerEntity } from '../../entities/customer.entity';

export class UpdateCustomerProvider {
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(data: {
    id: number;
    data: UpdateCustomerDTO;
    authUser: UserEntity;
  }): Promise<CustomerEntity> {
    const customer = await this.findCustomer(data.id);

    await this.validateDocument(data.data.document, customer.id);

    return await this.customerRepository.transaction(async (query) => {
      const updatedCustomer = await query.manager.save(
        await this.serializeCustomerData(customer, data.data, data.authUser),
      );

      return updatedCustomer;
    });
  }

  private async findCustomer(id: number) {
    const foundCustomer = await this.customerRepository.manager.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!foundCustomer) {
      throw new HttpException('Cliente não encontrado', 404);
    }

    if (foundCustomer.status === ECustomerStatus.INACTIVE) {
      throw new HttpException('Cliente está inativo', 422);
    }

    return foundCustomer;
  }

  private async validateDocument(document: string, id: number) {
    const customer = await this.customerRepository.manager.findOne({
      where: { document: ILike(document) },
    });

    if (customer && customer.id !== id) {
      throw new HttpException(
        'Já existe um cliente cadastrado com o documento informado',
        412,
      );
    }
  }

  private async serializeCustomerData(
    customer: CustomerEntity,
    data: UpdateCustomerDTO,
    user: UserEntity,
  ) {
    return plainToInstance(
      CustomerEntity,
      { ...customer, ...data, userUpdated: user, updatedAt: new Date() },
      { ignoreDecorators: true },
    );
  }
}
