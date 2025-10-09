import {
  Body,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { AuthUser } from '@modules/auth/domain/decorators/auth-user.decorator';
import { OccurrenceController } from '../../decorators/occurrence-controller.decorator';
import { OccurrenceService } from '@modules/occurrence/domain/services/occurrence.service';
import { OccurrenceEntity } from '@modules/occurrence/domain/entities/occurrence.entity';
import { CreateOccurrenceDTO } from '@modules/occurrence/domain/dtos/create-occurrence.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@OccurrenceController.default()
export class DefaultOccurrenceController {
  public constructor(private readonly service: OccurrenceService) {}
  //   @Endpoint.get({
  //     url: '/',
  //     description: 'Listar veículos',
  //     dtoName: 'FindManyVehicleDTO',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Listagem dos veículos',
  //         status: 200,
  //         findManyModel: VehicleEntity,
  //       },
  //     ],
  //   })
  //   public async findMany(@Query() dto: FindManyVehicleDTO) {
  //     return await this.service.findMany.execute({
  //       dto,
  //     });
  //   }

  //   @Endpoint.get({
  //     url: '/:uuid',
  //     description: 'Listar um único veículo com base em seu uuid',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Dados do veículo',
  //         status: 200,
  //         response: VehicleEntity,
  //       },
  //     ],
  //   })
  //   public async findOne(@Param('uuid') uuid: string) {
  //     return await this.service.findOne.execute(uuid);
  //   }

  @Endpoint.post({
    url: '/',
    description: 'Criar uma nova ocorrência',
    dtoName: 'CreateOccurrenceDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Ocorrência criada com sucesso',
        status: 200,
        response: OccurrenceEntity,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  @UseInterceptors(FileInterceptor('imageFile'))
  public async create(
    @Body() dto: CreateOccurrenceDTO,
    @AuthUser() authUser: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.service.create.execute({
      dto,
      authUser,
      file,
    });
  }

  //   @Endpoint.put({
  //     url: '/:uuid',
  //     description: 'Editar um veículo existente utilizando seu uuid',
  //     dtoName: 'UpdateVehicleDTO',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Veículo editado com sucesso',
  //         status: 200,
  //         response: VehicleEntity,
  //       },
  //       {
  //         description: 'Veículo não encontrado',
  //         status: 404,
  //       },
  //       {
  //         description: 'Ocorreu um erro de validação do objeto enviado',
  //         status: 412,
  //       },
  //     ],
  //   })
  //   public async update(
  //     @Param('uuid') uuid: string,
  //     @Body() data: UpdateVehicleDTO,
  //     @AuthUser() authUser: UserEntity,
  //   ) {
  //     return await this.service.update.execute({
  //       uuid,
  //       data,
  //       authUser,
  //     });
  //   }

  //   @Endpoint.delete({
  //     url: '/:uuid',
  //     description: 'Apagar um veículo com base em seu uuid',
  //     roles: [],
  //     actions: [],
  //     abilities: [],
  //     responses: [
  //       {
  //         description: 'Veículo deletado com sucesso',
  //         status: 200,
  //       },
  //       {
  //         description: 'Veículo não encontrado',
  //         status: 404,
  //       },
  //     ],
  //   })
  //   public async delete(@Param('uuid') uuid: string) {
  //     return await this.service.delete.execute({
  //       uuid,
  //     });
  //   }
}
