import { Body, Param, Query, UseGuards } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { CustomerController } from '../../decorators/customer-controller.decorator';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';
import { CreateCustomerDTO } from '@modules/customer/domain/dtos/create-customer.dto';
import { AuthGuard } from '@modules/auth/domain/guards/auth.guard';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

@CustomerController.default()
export class DefaultCustomerController {
  public constructor(private readonly service: CustomerService) {}

  //   @Endpoint.get({
  //     url: '/',
  //     description: 'Listar usuários',
  //     dtoName: 'FindManyUserDTO',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Listagem dos usuários',
  //         status: 200,
  //         findManyModel: UserEntity,
  //       },
  //     ],
  //   })
  //   public async findMany(
  //     @Query() dto: FindManyUserDTO,
  //     @AuthUser() authUser: UserEntity,
  //   ) {
  //     return await this.service.findMany.execute({
  //       dto,
  //       authUser,
  //     });
  //   }

  //   @Endpoint.get({
  //     url: '/:id',
  //     description: 'Listar um único usuário com base em seu id',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Dados do usuário',
  //         status: 200,
  //         response: UserEntity,
  //       },
  //     ],
  //   })
  //   public async findOne(
  //     @Param('id') id: number,
  //     @AuthUser() authUser: UserEntity,
  //   ) {
  //     return await this.service.findOne.execute({
  //       id,
  //       authUser,
  //     });
  //   }

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
  @UseGuards(AuthGuard)
  public async create(
    @Body() dto: CreateCustomerDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.create.execute({
      dto,
      authUser,
    });
  }

  //   @Endpoint.put({
  //     url: '/:id',
  //     description: 'Editar um usuário existente utilizando seu ID',
  //     dtoName: 'UpdateUserDTO',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Usuário editado com sucesso',
  //         status: 200,
  //         response: UserEntity,
  //       },
  //       {
  //         description: 'Usuário não encontrado',
  //         status: 404,
  //       },
  //       {
  //         description: 'Ocorreu um erro de validação do objeto enviado',
  //         status: 412,
  //       },
  //     ],
  //   })
  //   public async update(
  //     @Param('id') id: number,
  //     @Body() data: UpdateUserDTO,
  //     @AuthUser() authUser: UserEntity,
  //   ) {
  //     return await this.service.update.execute({
  //       id,
  //       data,
  //       authUser,
  //     });
  //   }

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
  public async delete(
    @Param('id') id: number,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.delete.execute({
      id,
      authUser,
    });
  }
}
