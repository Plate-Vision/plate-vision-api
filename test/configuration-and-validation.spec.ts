import 'reflect-metadata';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';
import { Connection } from '@core/database/domain/classes/connection.class';
import { EConnection } from '@core/database/domain/enums/connection.enum';
import { ValidatorPipe } from '@core/config/validator/validator-pipe.config';
import { ParseJsonFieldsInterceptor } from '@core/base/interceptors/parse-json-fields.interceptor';
import { LoginDTO } from '@modules/auth/domain/dtos/login.dto';

const variables = {
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: '5432',
  DATABASE_NAME: 'test',
  DATABASE_USER: 'test-user',
  DATABASE_PASS: 'test-password',
  API_URL: 'http://localhost',
  API_PORT: '5000',
  API_DOC_PASS: 'test-documentation',
  API_AUTH_TOKEN: 'test-signing-key',
  API_CLIENT_URL: 'http://localhost:5173',
  NODE_ENV: 'development',
};
afterEach(() => jest.restoreAllMocks());

describe('Environment configuration', () => {
  it('maps application and database settings from ConfigService', () => {
    const env = new EnvironmentVariablesProvider({
      get: (key: string) => variables[key],
    } as ConfigService);
    expect(env.isDevelopment).toBe(true);
    expect(env.database).toEqual({
      host: 'localhost',
      port: '5432',
      name: 'test',
      user: 'test-user',
      pass: 'test-password',
    });
    expect(env.application).toEqual({
      url: 'http://localhost',
      port: '5000',
      docPass: 'test-documentation',
      authToken: 'test-signing-key',
      client: 'http://localhost:5173',
    });
  });

  it('falls back to process.env with and without ConfigService', () => {
    const previous = { ...process.env };
    try {
      Object.assign(process.env, variables, { NODE_ENV: 'production' });
      expect(new EnvironmentVariablesProvider().isDevelopment).toBe(false);
      expect(
        new EnvironmentVariablesProvider(new ConfigService()).database.host,
      ).toBe('localhost');
    } finally {
      process.env = previous;
    }
  });

  it('reports the first missing required variable', () => {
    const previous = process.env.DATABASE_HOST;
    delete process.env.DATABASE_HOST;
    try {
      expect(() => new EnvironmentVariablesProvider()).toThrow(
        'Variável de Ambiente DATABASE_HOST não encontrada',
      );
    } finally {
      if (previous !== undefined) process.env.DATABASE_HOST = previous;
    }
  });

  it('builds database options without schema synchronization', () => {
    const previousSeed = process.env.RUNNING_SEED;
    const env = new EnvironmentVariablesProvider({
      get: (key: string) => variables[key],
    } as ConfigService);
    try {
      process.env.RUNNING_SEED = 'false';
      const normal = new Connection(EConnection.DATABASE, env).getConnection();
      expect(normal).toEqual(
        expect.objectContaining({
          type: 'postgres',
          synchronize: false,
          migrationsTableName: 'migrations_typeorm',
          entities: ['dist/**/*.entity{.ts,.js}'],
          migrations: ['dist/core/database/migrations/*{.js,.ts}'],
        }),
      );
      process.env.RUNNING_SEED = 'true';
      const seed = new Connection(
        EConnection.DATABASE,
        env,
        'custom',
        'archive',
      ).getConnection();
      expect(seed.entities).toEqual(['src/**/*.entity-archive{.ts,.js}']);
      expect(seed.migrations).toEqual([
        'dist/core/database/migrations/custom/*{.js,.ts}',
      ]);
    } finally {
      if (previousSeed === undefined) delete process.env.RUNNING_SEED;
      else process.env.RUNNING_SEED = previousSeed;
    }
  });
});

describe('DTO validator pipe', () => {
  const pipe = new ValidatorPipe();

  it.each([String, Boolean, Number, Array, Object, undefined])(
    'passes primitive or unspecified metatype %p through',
    async (metatype) => {
      const value = { arbitrary: 'value' };
      expect(await pipe.transform(value, { type: 'body', metatype })).toBe(
        value,
      );
    },
  );

  it('returns a valid DTO body unchanged after validation', async () => {
    const value = { email: 'member@example.com', password: 'valid-password' };
    expect(
      await pipe.transform(value, { type: 'body', metatype: LoginDTO }),
    ).toBe(value);
  });

  it('reports invalid DTOs using the existing HTTP409 contract', async () => {
    await expect(
      pipe.transform(
        { email: 'invalid' },
        { type: 'body', metatype: LoginDTO },
      ),
    ).rejects.toMatchObject({
      status: 409,
      response: { errors: expect.any(Array) },
    });
  });
});

describe('Multipart JSON field parser', () => {
  const createSubject = (body?: Record<string, unknown>) => {
    const request = { body };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    const result = of('response');
    const next = {
      handle: jest.fn().mockReturnValue(result),
    } as unknown as CallHandler;
    return { request, context, next, result };
  };

  it('parses configured JSON fields and keeps other values intact', () => {
    const { request, context, next, result } = createSubject({
      vehicle: '{"id":7}',
      other: 'plain',
      existing: { id: 8 },
    });
    const parser = new ParseJsonFieldsInterceptor([
      'vehicle',
      'existing',
      'missing',
    ]);
    expect(parser.intercept(context, next)).toBe(result);
    expect(request.body).toEqual({
      vehicle: { id: 7 },
      other: 'plain',
      existing: { id: 8 },
    });
  });

  it('logs malformed JSON and still delegates to the handler', () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { request, context, next } = createSubject({ vehicle: '{invalid' });
    new ParseJsonFieldsInterceptor(['vehicle']).intercept(context, next);
    expect(request.body.vehicle).toBe('{invalid');
    expect(error).toHaveBeenCalledWith(
      'Erro ao fazer parse do campo vehicle:',
      expect.any(SyntaxError),
    );
    expect(next.handle).toHaveBeenCalledTimes(1);
  });

  it('allows requests without a body', () => {
    const { context, next, result } = createSubject();
    expect(
      new ParseJsonFieldsInterceptor(['vehicle']).intercept(context, next),
    ).toBe(result);
  });
});
