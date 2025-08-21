import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { CreateUserDTO } from '@modules/user/domain/dtos/create-user.dto';
import { UpdateUserDTO } from '@modules/user/domain/dtos/update-user.dto';
import { FindManyUserDTO } from '@modules/user/domain/dtos/find-many-user.dto';

import { UserController } from '../decorators/user-controller.decorator';

@UserController.default()
export class DefaultUserController {
  public constructor(private readonly service: UserService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar usuários',
    dtoName: 'FindManyUserDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Listagem dos usuários',
        status: 200,
        findManyModel: UserEntity,
      },
    ],
  })
  public async findMany(
    @Query() dto: FindManyUserDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.findMany.execute({
      dto,
      authUser,
    });
  }

  @Endpoint.get({
    url: '/:id',
    description: 'Listar um único usuário com base em seu id',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Dados do usuário',
        status: 200,
        response: UserEntity,
      },
    ],
  })
  public async findOne(
    @Param('id') id: number,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.findOne.execute({
      id,
      authUser,
    });
  }

  @Endpoint.post({
    url: '/',
    description: 'Criar um novo usuário',
    dtoName: 'CreateUserDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Usuário criado com sucesso',
        status: 200,
        response: UserEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async create(
    @Body() dto: CreateUserDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.create.execute({
      dto,
      authUser,
    });
  }

  @Endpoint.put({
    url: '/:id',
    description: 'Editar um usuário existente utilizando seu ID',
    dtoName: 'UpdateUserDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Usuário editado com sucesso',
        status: 200,
        response: UserEntity,
      },
      {
        description: 'Usuário não encontrado',
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
    @Body() data: UpdateUserDTO,
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
    description: 'Apagar um usuário com base em seu ID',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Usuário deletado com sucesso',
        status: 200,
      },
      {
        description: 'Usuário não encontrado',
        status: 404,
      },
      {
        description: 'Não é possível deletar o próprio usuário',
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
