import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { CreateAbilityDTO } from '@modules/role/domain/dtos/create-ability.dto';
import { UpdateAbilityDTO } from '@modules/role/domain/dtos/update-ability.dto';
import { FindManyAbilityDTO } from '@modules/role/domain/dtos/find-many-ability.dto';

import { AbilityController } from '../../decorators/ability-controller.decorator';
import { AbilityService } from '@modules/role/domain/services/ability.service';

@AbilityController.default()
export class AbilityRoute {
  public constructor(private readonly service: AbilityService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar habilidades',
    dtoName: 'FindManyAbilityDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Listagem das habilidades',
        status: 200,
        findManyModel: AbilityEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyAbilityDTO) {
    return await this.service.findMany.execute(dto);
  }

  @Endpoint.get({
    url: '/:uuid',
    description: 'Listar uma habilidade com base em seu uuid',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Dados da habilidade',
        status: 200,
        response: AbilityEntity,
      },
    ],
  })
  public async findOne(@Param('uuid') uuid: string) {
    return await this.service.findOne.execute(uuid);
  }

  @Endpoint.post({
    url: '/',
    description: 'Criar uma nova habilidade',
    dtoName: 'CreateAbilityDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Habilidade criada com sucesso',
        status: 200,
        response: AbilityEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async create(@Body() dto: CreateAbilityDTO) {
    return await this.service.create.execute(dto);
  }

  @Endpoint.put({
    url: '/:uuid',
    description: 'Editar uma habilidade existente utilizando seu uuid',
    dtoName: 'UpdateAbilityDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Habilidade editada com sucesso',
        status: 200,
        response: AbilityEntity,
      },
      {
        description: 'Habilidade não encontrada',
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
    @Body() dto: UpdateAbilityDTO,
  ) {
    return await this.service.update.execute(uuid, dto);
  }

  @Endpoint.delete({
    url: '/:uuid',
    description: 'Apagar uma habildiade com base em seu uuid',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Habilidade excluída com sucesso',
        status: 200,
      },
      {
        description: 'Habilidade não encontrada',
        status: 404,
      },
      {
        description: 'Habilidade em uso',
        status: 422,
      },
    ],
  })
  public async delete(@Param('uuid') uuid: string) {
    return await this.service.delete.execute(uuid);
  }
}
