import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { VehicleController } from '../../decorators/vehicle-controller.decorator';
import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { CreateVehicleDTO } from '@modules/vehicle/domain/dtos/create-vehicle.dto';
import { Body } from '@nestjs/common';

@VehicleController.withoutLogin()
export class WithoutLoginVehicleController {
  public constructor(private readonly service: VehicleService) {}
  @Endpoint.post({
    url: '/ia',
    description: 'Criar ou editar um veículo pela IA',
    dtoName: 'CreateVehicleDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Veículo criado ou atualizado com sucesso',
        status: 200,
        response: VehicleEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  public async create(@Body() dto: CreateVehicleDTO) {
    return await this.service.createIa.execute({
      dto,
    });
  }
}
