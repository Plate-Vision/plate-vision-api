import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerEntity } from './domain/entities/customer.entity';
import { CustomerRepository } from './infra/repositories/customer.repository';
import { CustomerService } from './domain/services/customer.service';
import { CustomerControllers } from './application/controllers/customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [CustomerRepository, CustomerService],
  controllers: [...CustomerControllers],
  exports: [CustomerRepository],
})
export class CustomerModule {}
