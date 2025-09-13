import { Injectable } from '@nestjs/common';
import { CreateCustomerProvider } from './providers/create-customer.provider';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';

@Injectable()
export class CustomerService {
  public create: CreateCustomerProvider;

  public constructor(private readonly customerRepository: CustomerRepository) {
    this.create = new CreateCustomerProvider(this.customerRepository);
  }
}
