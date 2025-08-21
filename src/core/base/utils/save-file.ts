import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export class SaveFile {
  private static defineBody(names: string[]) {
    const properties = {};
    names.map((name) => {
      properties[name] = {
        type: 'string',
        format: 'binary',
      };
    });

    return ApiBody({
      schema: {
        type: 'object',
        properties,
      },
    });
  }

  private static base(name: string[]) {
    return applyDecorators(
      ApiConsumes('multipart/form-data'),
      this.defineBody(name),
    );
  }

  private static defineInterceptors(
    names: string[],
    maxCount: number,
  ): MulterField[] {
    return names.map((name) => {
      return {
        name,
        maxCount,
      };
    });
  }

  private static defineFileInterceptor(
    name: string[],
    maxCount: number,
    typeFile: MulterOptions,
  ) {
    if (name.length == 1 && maxCount == 1) {
      return FileInterceptor(name[0], typeFile);
    }

    if (name.length == 1) {
      return FilesInterceptor(name[0], maxCount, typeFile);
    }
    return FileFieldsInterceptor(
      this.defineInterceptors(name, maxCount),
      typeFile,
    );
  }

  public static multiple(typeFile: MulterOptions, name: string[]) {
    return applyDecorators(
      UseInterceptors(this.defineFileInterceptor(name, 35, typeFile)),
      this.base(name),
    );
  }

  public static unique(typeFile: MulterOptions, name: string[]) {
    return applyDecorators(
      UseInterceptors(this.defineFileInterceptor(name, 1, typeFile)),
      this.base(name),
    );
  }
}
