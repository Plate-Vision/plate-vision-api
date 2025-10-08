import { Injectable } from '@nestjs/common';
import { CreateCustomerProvider } from './providers/create-customer.provider';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { DeleteCustomerProvider } from './providers/delete-customer.provider';
import { UpdateCustomerProvider } from './providers/update-customer.provider';
import { FindManyCustomerProvider } from './providers/find-many-customer.provider';
import { FindOneCustomerProvider } from './providers/find-one-customer.provider';

@Injectable()
export class CustomerService {
  public create: CreateCustomerProvider;
  public delete: DeleteCustomerProvider;
  public update: UpdateCustomerProvider;
  public findMany: FindManyCustomerProvider;
  public findOne: FindOneCustomerProvider;

  public constructor(private readonly customerRepository: CustomerRepository) {
    this.create = new CreateCustomerProvider(this.customerRepository);
    this.delete = new DeleteCustomerProvider(this.customerRepository, this);
    this.update = new UpdateCustomerProvider(this.customerRepository, this);
    this.findMany = new FindManyCustomerProvider(this.customerRepository);
    this.findOne = new FindOneCustomerProvider(this.customerRepository);
  }
}
