import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { HttpException } from '@nestjs/common';

import { MessagePayload } from '@shared/payloads/message.payload';
import { CustomerEntity } from '../../entities/customer.entity';
import { ECustomerStatus } from '../../enums/customer-status.enum';

export class DeleteCustomerProvider {
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute(data: {
    id: number;
    authUser: UserEntity;
  }): Promise<MessagePayload> {
    const customer = await this.findCustomer(data.id);

    await this.customerRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.update(
        CustomerEntity,
        { id: customer.id },
        {
          deletedAt: new Date(),
          status: ECustomerStatus.INACTIVE,
          userUpdated: data.authUser,
        },
      );
    });

    return { message: 'Cliente deletado com sucesso' };
  }

  private async findCustomer(id: number) {
    const customer = await this.customerRepository.manager.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!customer) {
      throw new HttpException('Cliente não encontrado', 404);
    }

    if (customer.status === ECustomerStatus.INACTIVE) {
      throw new HttpException('Cliente já está inativo', 422);
    }

    return customer;
  }
}
