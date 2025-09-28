import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { VehicleController } from '../../decorators/vehicle-controller.decorator';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { CreateVehicleDTO } from '@modules/vehicle/domain/dtos/create-vehicle.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { FindManyVehicleDTO } from '@modules/vehicle/domain/dtos/find-many-vehicle.dto';
import { UpdateVehicleDTO } from '@modules/vehicle/domain/dtos/update-vehicle.dto';

@VehicleController.default()
export class DefaultVehicleController {
  public constructor(private readonly service: VehicleService) {}
  @Endpoint.get({
    url: '/',
    description: 'Listar veículos',
    dtoName: 'FindManyVehicleDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Listagem dos veículos',
        status: 200,
        findManyModel: VehicleEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyVehicleDTO) {
    return await this.service.findMany.execute({
      dto,
    });
  }

  @Endpoint.get({
    url: '/:uuid',
    description: 'Listar um único veículo com base em seu uuid',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Dados do veículo',
        status: 200,
        response: VehicleEntity,
      },
    ],
  })
  public async findOne(@Param('uuid') uuid: string) {
    return await this.service.findOne.execute(uuid);
  }

  @Endpoint.post({
    url: '/',
    description: 'Criar um novo veículo manual',
    dtoName: 'CreateVehicleDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Veículo criado com sucesso',
        status: 200,
        response: VehicleEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async create(
    @Body() dto: CreateVehicleDTO,
    @AuthUser() authUser: UserEntity,
  ) {
    return await this.service.create.execute({
      dto,
      authUser,
    });
  }

  @Endpoint.put({
    url: '/:uuid',
    description: 'Editar um veículo existente utilizando seu uuid',
    dtoName: 'UpdateVehicleDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Veículo editado com sucesso',
        status: 200,
        response: VehicleEntity,
      },
      {
        description: 'Veículo não encontrado',
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
    @Body() data: UpdateVehicleDTO,
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
    description: 'Apagar um veículo com base em seu uuid',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Veículo deletado com sucesso',
        status: 200,
      },
      {
        description: 'Veículo não encontrado',
        status: 404,
      },
    ],
  })
  public async delete(@Param('uuid') uuid: string) {
    return await this.service.delete.execute({
      uuid,
    });
  }
}
