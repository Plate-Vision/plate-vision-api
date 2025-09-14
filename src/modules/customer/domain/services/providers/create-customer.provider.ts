import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { CreateCustomerDTO } from '../../dtos/create-customer.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ILike, QueryRunner } from 'typeorm';
import { CustomerEntity } from '../../entities/customer.entity';
import { HttpException } from '@nestjs/common';

export class CreateCustomerProvider {
  public constructor(private readonly customerRepository: CustomerRepository) {}

  public async execute({
    dto,
    authUser,
    queryRunner,
  }: {
    dto: CreateCustomerDTO;
    authUser?: UserEntity;
    queryRunner?: QueryRunner;
  }): Promise<CustomerEntity> {
    await this.validateDocument(dto.document);

    if (queryRunner) {
      return await this.saveCustomerWithTransaction(dto, authUser, queryRunner);
    }

    return await this.customerRepository.transaction(async (query) => {
      return await this.saveCustomerWithTransaction(dto, authUser, query);
    });
  }

  private async validateDocument(document: string): Promise<void> {
    const customer = await this.customerRepository.manager.findOne({
      where: { document: ILike(document) },
    });

    if (customer) {
      throw new HttpException(
        'Já existe um cliente cadastrado com o documento informado',
        412,
      );
    }
  }

  private async saveCustomerWithTransaction(
    dto: CreateCustomerDTO,
    authUser: UserEntity,
    query: QueryRunner,
  ) {
    const customer = await query.manager.save(
      CustomerEntity,
      await this.serialize(dto, authUser),
    );

    return customer;
  }

  private async serialize(dto: CreateCustomerDTO, authUser: UserEntity) {
    return {
      ...dto,
      userCreated: authUser,
    };
  }
}
