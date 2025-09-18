import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { CustomerController } from '../../decorators/customer-controller.decorator';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { CreateCustomerDTO } from '@modules/customer/domain/dtos/create-customer.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UpdateCustomerDTO } from '@modules/customer/domain/dtos/update-customer.dto';
import { FindManyCustomerDTO } from '@modules/customer/domain/dtos/find-many-customer.dto';

@CustomerController.default()
export class DefaultCustomerController {
  public constructor(private readonly service: CustomerService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar clientes',
    dtoName: 'FindManyCustomerDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Listagem dos clientes',
        status: 200,
        findManyModel: CustomerEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyCustomerDTO) {
    return await this.service.findMany.execute({
      dto,
    });
  }

  @Endpoint.get({
    url: '/:id',
    description: 'Listar um único cliente com base em seu id',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Dados do cliente',
        status: 200,
        response: CustomerEntity,
      },
    ],
  })
  public async findOne(@Param('id') id: number) {
    return await this.service.findOne.execute({
      id,
    });
  }

  @Endpoint.post({
    url: '/',
    description: 'Criar um novo cliente',
    dtoName: 'CreateCustomerDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Cliente criado com sucesso',
        status: 200,
        response: CustomerEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async create(
    @Body() dto: CreateCustomerDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.create.execute({
      dto,
      authUser,
    });
  }

  @Endpoint.patch({
    url: '/:id',
    description: 'Editar um cliente existente utilizando seu ID',
    dtoName: 'UpdateCustomerDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Cliente editado com sucesso',
        status: 200,
        response: CustomerEntity,
      },
      {
        description: 'Cliente não encontrado',
        status: 404,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async update(
    @Param('id') id: number,
    @Body() data: UpdateCustomerDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.update.execute({
      id,
      data,
      authUser,
    });
  }

  @Endpoint.delete({
    url: '/:id',
    description: 'Apagar um cliente com base em seu ID',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Cliente deletado com sucesso',
        status: 200,
      },
      {
        description: 'Cliente não encontrado',
        status: 404,
      },
    ],
  })
  public async delete(@Param('id') id: number) {
    return await this.service.delete.execute({
      id,
    });
  }
}
