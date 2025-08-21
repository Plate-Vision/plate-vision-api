import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { RoleService } from '@modules/role/services/role.service';
import { CreateRoleDTO } from '@modules/role/domain/dtos/create-role.dto';
import { UpdateRoleDTO } from '@modules/role/domain/dtos/update-role.dto';
import { FindManyRoleDTO } from '@modules/role/domain/dtos/find-many-role.dto';

import { RoleController } from '../decorators/role-controller.decorator';

@RoleController.default()
export class RoleRoute {
  public constructor(private readonly service: RoleService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar perfis de usuário',
    dtoName: 'FindManyRoleDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Listagem dos perfis de usuário',
        status: 200,
        findManyModel: RoleEntity,
      },
    ],
  })
  public async findMany(@Query() data: FindManyRoleDTO) {
    return await this.service.findMany.execute(data);
  }

  @Endpoint.get({
    url: '/:id',
    description: 'Listar um perfil de usuário com base em seu id',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Dados do perfil do usuário',
        status: 200,
        response: RoleEntity,
      },
    ],
  })
  public async findOne(@Param('id') id: number) {
    return await this.service.findOne.execute(id);
  }

  @Endpoint.post({
    url: '/',
    description: 'Criar um novo perfil de usuário',
    dtoName: 'CreateRoleDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Perfil de usuário criado com sucesso',
        status: 200,
        response: RoleEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async create(@Body() dto: CreateRoleDTO) {
    return await this.service.create.execute(dto);
  }

  @Endpoint.put({
    url: '/:id',
    description: 'Editar um perfil de usuário existente utilizando seu ID',
    dtoName: 'UpdateRoleDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Perfil de usuário editado com sucesso',
        status: 200,
        response: RoleEntity,
      },
      {
        description: 'Perfil de usuário não encontrado',
        status: 404,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async update(@Param('id') id: number, @Body() data: UpdateRoleDTO) {
    return await this.service.update.execute(id, data);
  }

  @Endpoint.delete({
    url: '/:id',
    description: 'Apagar um perfil de usuário com base em seu ID',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Perfil de usuário excluído com sucesso',
        status: 200,
      },
      {
        description: 'Perfil de usuário não encontrado',
        status: 404,
      },
      {
        description: 'Perfil de usuário em uso',
        status: 422,
      },
    ],
  })
  public async delete(@Param('id') id: number) {
    return await this.service.delete.execute(id);
  }
}
