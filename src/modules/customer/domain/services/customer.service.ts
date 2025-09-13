import { Injectable } from '@nestjs/common';
import { CreateCustomerProvider } from './providers/create-customer.provider';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { DeleteCustomerProvider } from './providers/delete-customer.provider';

@Injectable()
export class CustomerService {
  public create: CreateCustomerProvider;
  public delete: DeleteCustomerProvider;

  public constructor(private readonly customerRepository: CustomerRepository) {
    this.create = new CreateCustomerProvider(this.customerRepository);
    this.delete = new DeleteCustomerProvider(this.customerRepository);
  }
}
