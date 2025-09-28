import { ILike } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { UpdateCustomerDTO } from '../../dtos/update-customer.dto';
import { CustomerEntity } from '../../entities/customer.entity';
import { CustomerService } from '../customer.service';

export class UpdateCustomerProvider {
  public constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerSerivce: CustomerService,
  ) {}

  public async execute(data: {
    uuid: string;
    data: UpdateCustomerDTO;
    authUser: UserEntity;
  }): Promise<CustomerEntity> {
    const customer = await this.customerSerivce.findOne.execute({
      uuid: data.uuid,
    });

    await this.validateDocument(data.data.document, customer.uuid);

    return await this.customerRepository.transaction(async (query) => {
      const updatedCustomer = await query.manager.save(
        await this.serializeCustomerData(customer, data.data, data.authUser),
      );

      return updatedCustomer;
    });
  }

  private async validateDocument(document: string, uuid: string) {
    const customer = await this.customerRepository.manager.findOne({
      where: { document: ILike(document) },
    });

    if (customer && customer.uuid !== uuid) {
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
      { ...customer, ...data, userUpdated: user },
      { ignoreDecorators: true },
    );
  }
}
