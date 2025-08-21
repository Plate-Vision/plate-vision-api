import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

import { FindManyPayload } from '@shared/payloads/find-many.payload';

export function FindManyResponse<TModel extends Type<unknown>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(FindManyPayload, model),
    ApiOkResponse({
      description: `The result of ${model.name}`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(FindManyPayload) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
}
