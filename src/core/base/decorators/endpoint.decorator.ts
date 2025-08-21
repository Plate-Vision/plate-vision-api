import {
  Delete,
  Get,
  Patch,
  Post,
  Put,
  SetMetadata,
  Type,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { Roles } from '@modules/auth/domain/decorators/role.decorator';
import { Abilities } from '@modules/auth/domain/decorators/ability.decorator';
import { ERoleReference } from '@modules/role/domain/enums/role-reference.enum';
import { EAbilityReference } from '@modules/role/domain/enums/ability-reference.enum';

import { SaveFile } from '../utils/save-file';
import { EndpointMethod } from '../enums/endpoint-method.enum';
import { FindManyResponse } from '../utils/find-many-reponse-doc';
import { saveFileWithFormat } from '../utils/file-validation';

interface IEndpointResponse {
  status: number;
  findManyModel?: Type<unknown>;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  response?: Function;
}

interface IEndpointData {
  url: string;
  description: string;
  dtoName?: string;
  withoutLogin?: boolean;
  responses: Array<IEndpointResponse>;
  roles?: Array<keyof typeof ERoleReference>;
  actions?: Array<Action>;
  abilities?: Array<keyof typeof EAbilityReference>;
}

type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

interface IEndpointBaseData extends IEndpointData {
  type: EndpointMethod;
}

export class Endpoint {
  private static base({
    type,
    url,
    description,
    dtoName,
    responses,
    withoutLogin,
    roles,
    actions,
    abilities,
  }: IEndpointBaseData) {
    const decorators = [
      this.defineMethod(type, url),
      ...this.defineResponses(responses, withoutLogin, !!dtoName),
      ApiOperation({
        summary: description,
        description: this.createDescription(
          description,
          dtoName,
          roles?.map((key) => ERoleReference[key]),
          abilities?.map((key) => EAbilityReference[key]),
        ),
      }),
    ];

    if (roles && roles.length) {
      decorators.push(
        this.defineRolesPermitted(roles.map((key) => ERoleReference[key])),
      );
    }

    if (abilities && abilities.length) {
      decorators.push(
        this.defineAbilitiesPermitted(
          abilities.map((key) => EAbilityReference[key]),
        ),
      );
    }

    if (actions && actions.length) {
      decorators.push(this.defineActionsPermitted(actions));
    }

    return applyDecorators(...decorators);
  }

  private static defineMethod(type: EndpointMethod, url: string) {
    switch (type) {
      case EndpointMethod.GET:
        return applyDecorators(Get(url));
      case EndpointMethod.POST:
        return applyDecorators(Post(url));
      case EndpointMethod.PATCH:
        return applyDecorators(Patch(url));
      case EndpointMethod.PUT:
        return applyDecorators(Put(url));
      case EndpointMethod.DELETE:
        return applyDecorators(Delete(url));
      default:
        break;
    }
  }

  private static defineResponses(
    responses: IEndpointResponse[],
    withoutLogin?: boolean,
    haveDto?: boolean,
  ) {
    responses.push({
      status: 500,
      description: 'Erro interno no servidor',
    });

    if (!withoutLogin) {
      responses.push({
        status: 401,
        description:
          'O usuário precisa estar logado para acessar este endpoint',
      });
    }

    if (haveDto) {
      responses.push({
        status: 409,
        description: 'Um dos campos necessários no DTO não foram enviados',
      });
    }

    return responses.map(({ status, description, response, findManyModel }) => {
      if (findManyModel) {
        return FindManyResponse(findManyModel);
      }

      const object = {
        status: status,
        description: description,
      };

      if (response) {
        object['schema'] = {
          $ref: getSchemaPath(response),
        };
      }

      const decorator = [ApiResponse(object)];

      if (response) {
        decorator.push(ApiExtraModels(response));
      }

      return applyDecorators(...decorator);
    });
  }

  private static defineRolesPermitted(roles: Array<ERoleReference>) {
    return applyDecorators(Roles(...roles));
  }

  private static defineAbilitiesPermitted(abilities: Array<EAbilityReference>) {
    return applyDecorators(Abilities(...abilities));
  }

  private static defineActionsPermitted(actions: Array<Action>) {
    return applyDecorators(SetMetadata('actions', actions));
  }

  private static createDescription(
    description: string,
    dtoName: string,
    roles: Array<ERoleReference>,
    abilities: Array<EAbilityReference>,
    actions?: Array<Action>,
  ) {
    if (dtoName) {
      description += `- Para mais informações do DTO acesse o model ${dtoName}`;
    }

    if (roles && roles.length) {
      description += `- Esta rota possui limitações de permissão, sendo permitida apenas para os seguintes perfis (${roles.join(', ')})`;
    }

    if (abilities && abilities.length) {
      description += `- Esta rota possui limitações de permissão, sendo permitida apenas para os seguintes habilidades (${abilities.join(', ')})`;
    }

    if (actions && actions.length) {
      description += `- Esta rota possui limitações de permissão, sendo permitida apenas habilidades com alguma das seguintes ações (${actions.join(', ')})`;
    }

    return description;
  }

  public static get(data: IEndpointData) {
    return this.base({ type: EndpointMethod.GET, ...data });
  }

  public static post(data: IEndpointData) {
    return this.base({ type: EndpointMethod.POST, ...data });
  }

  public static patch(data: IEndpointData) {
    return this.base({ type: EndpointMethod.PATCH, ...data });
  }

  public static put(data: IEndpointData) {
    return this.base({ type: EndpointMethod.PUT, ...data });
  }

  public static delete(data: IEndpointData) {
    return this.base({ type: EndpointMethod.DELETE, ...data });
  }
}
