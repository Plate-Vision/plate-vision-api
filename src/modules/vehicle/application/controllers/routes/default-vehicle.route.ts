import { Body, Param, Query } from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { VehicleController } from '../../decorators/vehicle-controller.decorator';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { CreateVehicleDTO } from '@modules/vehicle/domain/dtos/create-vehicle.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { FindManyVehicleDTO } from '@modules/vehicle/domain/dtos/find-many-vehicle.dto';

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
    url: '/:id',
    description: 'Listar um único veículo com base em seu id',
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
  public async findOne(@Param('id') id: number) {
    return await this.service.findOne.execute({
      id,
    });
  }

  @Endpoint.post({
    url: '/manual',
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
    return await this.service.createManual.execute({
      dto,
      authUser,
    });
  }

  //   @Endpoint.put({
  //     url: '/:id',
  //     description: 'Editar um cliente existente utilizando seu ID',
  //     dtoName: 'UpdateCustomerDTO',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Cliente editado com sucesso',
  //         status: 200,
  //         response: CustomerEntity,
  //       },
  //       {
  //         description: 'Cliente não encontrado',
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
  //     @Body() data: UpdateCustomerDTO,
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
    description: 'Apagar um veículo com base em seu ID',
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
  public async delete(@Param('id') id: number) {
    return await this.service.delete.execute({
      id,
    });
  }
}
