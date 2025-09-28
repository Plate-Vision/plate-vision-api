import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';

import { MessagePayload } from '@shared/payloads/message.payload';
import { CustomerEntity } from '../../entities/customer.entity';
import { CustomerService } from '../customer.service';

export class DeleteCustomerProvider {
  public constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly customerService: CustomerService,
  ) {}

  public async execute(data: { uuid: string }): Promise<MessagePayload> {
    const customer = await this.customerService.findOne.execute({
      uuid: data.uuid,
    });

    await this.customerRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(CustomerEntity, { id: customer.id });
    });

    return { message: 'Cliente deletado com sucesso' };
  }
}
