import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { ParkingRecordController } from '../../decorators/parking-record.decorator';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { ParkingRecordEntity } from '@modules/parking-record/domain/entities/parking-record.entity';
import { CreateParkingRecordDTO } from '@modules/parking-record/domain/dtos/create-parking-record.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UpdateParkingRecordDTO } from '@modules/parking-record/domain/dtos/update-parking-record.dto';
import { FindManyParkingRecordDTO } from '@modules/parking-record/domain/dtos/find-many-parking-record.dto';

@ParkingRecordController.default()
export class DefaultParkingRecordController {
  public constructor(private readonly service: ParkingRecordService) {}

  @Endpoint.get({
    url: '/',
    description: 'Listar registros',
    dtoName: 'FindManyParkingRecordDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Listagem dos registros',
        status: 200,
        findManyModel: ParkingRecordEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyParkingRecordDTO) {
    return await this.service.findMany.execute({
      dto,
    });
  }

  @Endpoint.get({
    url: '/:id',
    description: 'Listar um único registro com base em seu id',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Dados do registro',
        status: 200,
        response: ParkingRecordEntity,
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
    description: 'Criar um novo registro de estacionamento',
    dtoName: 'CreateParkingRecordDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Registro criado com sucesso',
        status: 200,
        response: ParkingRecordEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async create(
    @Body() dto: CreateParkingRecordDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.create.execute({
      dto,
      authUser,
    });
  }

  @Endpoint.put({
    url: '/:id',
    description: 'Editar um registro existente utilizando seu ID',
    dtoName: 'UpdateParkingRecordDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Registro editado com sucesso',
        status: 200,
        response: ParkingRecordEntity,
      },
      {
        description: 'Registro não encontrado',
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
    @Body() data: UpdateParkingRecordDTO,
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
    description: 'Apagar um registro com base em seu ID',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Registro deletado com sucesso',
        status: 200,
      },
      {
        description: 'Registro não encontrado',
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
