import { Injectable } from '@nestjs/common';
import { CreateCustomerProvider } from './providers/create-customer.provider';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { DeleteCustomerProvider } from './providers/delete-customer.provider';
import { UpdateCustomerProvider } from './providers/update-customer.provider';

@Injectable()
export class CustomerService {
  public create: CreateCustomerProvider;
  public delete: DeleteCustomerProvider;
  public update: UpdateCustomerProvider;

  public constructor(private readonly customerRepository: CustomerRepository) {
    this.create = new CreateCustomerProvider(this.customerRepository);
    this.delete = new DeleteCustomerProvider(this.customerRepository);
    this.update = new UpdateCustomerProvider(this.customerRepository);
  }
}
