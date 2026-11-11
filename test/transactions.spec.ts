import 'reflect-metadata';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

class TransactionSubject extends BaseRepository<BaseEntity> {}

afterEach(() => jest.restoreAllMocks());

const createSubject = () => {
  const events: string[] = [];
  const operation = (name: string) =>
    jest.fn<() => Promise<void>>().mockImplementation(async () => {
      events.push(name);
    });
  const runner = {
    connect: operation('connect'),
    startTransaction: operation('start'),
    commitTransaction: operation('commit'),
    rollbackTransaction: operation('rollback'),
    release: operation('release'),
  };
  const initialize = jest
    .spyOn(DataSource.prototype, 'initialize')
    .mockImplementation(async function () {
      events.push('initialize');
      return this;
    });
  jest
    .spyOn(DataSource.prototype, 'createQueryRunner')
    .mockReturnValue(runner as unknown as QueryRunner);
  const destroy = jest
    .spyOn(DataSource.prototype, 'destroy')
    .mockImplementation(async () => {
      events.push('destroy');
    });
  const env = {
    database: {
      host: 'localhost',
      port: 5432,
      name: 'unit-test',
      user: 'unit-test',
      pass: 'unit-test',
    },
  } as EnvironmentVariablesProvider;
  const provider = new TransactionSubject({} as Repository<BaseEntity>, env);
  return { provider, runner, events, initialize, destroy };
};

describe('Repository transaction lifecycle', () => {
  it('connects, starts, commits and releases resources in order', async () => {
    const { provider, runner, events } = createSubject();
    const result = { id: 3 };
    expect(
      await provider.transaction(async (query) => {
        expect(query).toBe(runner);
        events.push('work');
        return result;
      }),
    ).toBe(result);
    expect(events).toEqual([
      'initialize',
      'connect',
      'start',
      'work',
      'commit',
      'release',
      'destroy',
    ]);
    expect(runner.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('rolls back a callback failure and releases resources before rethrowing', async () => {
    const { provider, events } = createSubject();
    const failure = new Error('work failed');
    await expect(
      provider.transaction(async () => {
        events.push('work');
        throw failure;
      }),
    ).rejects.toBe(failure);
    expect(events).toEqual([
      'initialize',
      'connect',
      'start',
      'work',
      'rollback',
      'release',
      'destroy',
    ]);
  });

  it('rolls back a failed commit without hiding the original error', async () => {
    const { provider, runner, events } = createSubject();
    const failure = new Error('commit failed');
    runner.commitTransaction.mockRejectedValue(failure);
    await expect(provider.transaction(async () => 'result')).rejects.toBe(
      failure,
    );
    expect(events).toEqual([
      'initialize',
      'connect',
      'start',
      'rollback',
      'release',
      'destroy',
    ]);
  });
});
