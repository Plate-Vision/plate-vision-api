import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserService } from '@modules/user/domain/services/user.service';
import { CreateUserDTO } from '@modules/user/domain/dtos/create-user.dto';
import { UpdateUserDTO } from '@modules/user/domain/dtos/update-user.dto';
import { FindManyUserDTO } from '@modules/user/domain/dtos/find-many-user.dto';

import { UserController } from '../../decorators/user-controller.decorator';

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
    url: '/:uuid',
    description: 'Listar um único usuário com base em seu uuid',
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
    @Param('uuid') uuid: string,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.findOne.execute({
      uuid,
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
    url: '/:uuid',
    description: 'Editar um usuário existente utilizando seu uuid',
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
    @Param('uuid') uuid: string,
    @Body() data: UpdateUserDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.update.execute({
      uuid,
      data,
      authUser,
    });
  }

  @Endpoint.delete({
    url: '/:uuid',
    description: 'Apagar um usuário com base em seu uuid',
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
    @Param('uuid') uuid: string,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.delete.execute({
      uuid,
      authUser,
    });
  }
}
