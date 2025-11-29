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
import { ParseJsonFieldsInterceptor } from '@core/base/interceptors/parse-json-fields.interceptor';
import { OccurrenceController } from '../../decorators/occurrence-controller.decorator';
import { OccurrenceService } from '@modules/occurrence/domain/services/occurrence.service';
import { OccurrenceEntity } from '@modules/occurrence/domain/entities/occurrence.entity';
import { CreateOccurrenceDTO } from '@modules/occurrence/domain/dtos/create-occurrence.dto';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindManyOccurrenceDTO } from '@modules/occurrence/domain/dtos/find-many-occurrence.dto';
import { UpdateOccurrenceDTO } from '@modules/occurrence/domain/dtos/update-occurrence.dto';

@OccurrenceController.default()
export class DefaultOccurrenceController {
  public constructor(private readonly service: OccurrenceService) {}
  @Endpoint.get({
    url: '/',
    description: 'Listar ocorrências',
    dtoName: 'FindManyOccurrenceDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Listagem das ocorrências',
        status: 200,
        findManyModel: OccurrenceEntity,
      },
    ],
  })
  public async findMany(@Query() dto: FindManyOccurrenceDTO) {
    return await this.service.findMany.execute({
      dto,
    });
  }

  @Endpoint.get({
    url: '/:uuid',
    description: 'Listar uma única ocorrência com base em seu uuid',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Dados da ocorrência',
        status: 200,
        response: OccurrenceEntity,
      },
    ],
  })
  public async findOne(@Param('uuid') uuid: string) {
    return await this.service.findOne.execute(uuid);
  }

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
  @UseInterceptors(
    FileInterceptor('imageFile'),
    new ParseJsonFieldsInterceptor(['vehicle']),
  )
  public async create(
    @Body() dto: CreateOccurrenceDTO,
    @AuthUser() authUser: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
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

  @Endpoint.put({
    url: '/:uuid',
    description: 'Editar uma ocorrência existente utilizando seu uuid',
    dtoName: 'UpdateOccurrenceDTO',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Ocorrência editada com sucesso',
        status: 200,
        response: OccurrenceEntity,
      },
      {
        description: 'Ocorrência não encontrada',
        status: 404,
      },
      {
        description: 'Ocorreu um erro de validação do objeto enviado',
        status: 412,
      },
    ],
  })
  @UseInterceptors(
    FileInterceptor('imageFile'),
    new ParseJsonFieldsInterceptor(['vehicle']),
  )
  public async update(
    @Param('uuid') uuid: string,
    @Body() data: UpdateOccurrenceDTO,
    @AuthUser() authUser: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.service.update.execute({
      uuid,
      data,
      authUser,
      file,
    });
  }

  @Endpoint.delete({
    url: '/:uuid',
    description: 'Apagar uma ocorrência com base em seu uuid',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Ocorrência deletada com sucesso',
        status: 200,
      },
      {
        description: 'Ocorrência não encontrada',
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
