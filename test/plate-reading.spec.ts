import 'reflect-metadata';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { Logger } from '@nestjs/common';
import { In, IsNull, QueryRunner } from 'typeorm';
import { FindManyPlateReadingProvider } from '@modules/plate-reading/domain/services/providers/find-many-plate-reading.provider';
import { UpdatePlateReadingProvider } from '@modules/plate-reading/domain/services/providers/update-plate-reading.provider';
import { ProcessorPlateReadingProvider } from '@modules/plate-reading/domain/services/providers/processor-plate-reading.provider';
import { TaskProvider } from '@modules/plate-reading/domain/services/providers/task.provider';
import { PlateReadingEntity } from '@modules/plate-reading/domain/entities/plate-reading.entity';
import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { PlateReadingService } from '@modules/plate-reading/domain/services/plate-reading.service';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';

const createRunner = () => ({
  manager: {
    save: jest.fn<(entity: unknown, data?: unknown) => Promise<unknown>>(),
  },
});

beforeEach(() => {
  jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
});

afterEach(() => jest.restoreAllMocks());

describe('FindManyPlateReadingProvider', () => {
  it('fetches unprocessed readings in ascending order', async () => {
    const readings = [{ id: 1 }];
    const find = jest.fn<() => Promise<unknown>>().mockResolvedValue(readings);
    const provider = new FindManyPlateReadingProvider({
      manager: { find },
    } as unknown as PlateReadingRepository);

    expect(await provider.execute()).toBe(readings);
    expect(find).toHaveBeenCalledWith({
      where: { processedAt: IsNull() },
      order: { id: 'ASC' },
    });
  });

  it('returns an empty array without treating it as missing data', async () => {
    const provider = new FindManyPlateReadingProvider({
      manager: {
        find: jest.fn<() => Promise<unknown>>().mockResolvedValue([]),
      },
    } as unknown as PlateReadingRepository);

    expect(await provider.execute()).toEqual([]);
  });

  it('propagates repository failures', async () => {
    const failure = new Error('database unavailable');
    const provider = new FindManyPlateReadingProvider({
      manager: {
        find: jest.fn<() => Promise<unknown>>().mockRejectedValue(failure),
      },
    } as unknown as PlateReadingRepository);

    await expect(provider.execute()).rejects.toBe(failure);
  });
});

describe('UpdatePlateReadingProvider', () => {
  const createSubject = (
    readings: unknown = [{ id: 4, licensePlate: 'ABC1D23' }],
  ) => {
    const runner = createRunner();
    const find = jest.fn<() => Promise<unknown>>().mockResolvedValue(readings);
    const transaction = jest
      .fn<(work: (query: unknown) => Promise<unknown>) => Promise<unknown>>()
      .mockImplementation((work) => work(runner));
    const provider = new UpdatePlateReadingProvider({
      manager: { find },
      transaction,
    } as unknown as PlateReadingRepository);
    return { provider, runner, find, transaction };
  };

  it('marks readings as processed with the caller transaction', async () => {
    const { provider, runner, find, transaction } = createSubject();
    const saved = [{ id: 4 }];
    runner.manager.save.mockResolvedValue(saved);

    expect(
      await provider.execute({
        ids: [4],
        queryRunner: runner as unknown as QueryRunner,
      }),
    ).toBe(saved);
    expect(find).toHaveBeenCalledWith({ where: { id: In([4]) } });
    expect(runner.manager.save).toHaveBeenCalledWith(PlateReadingEntity, [
      expect.objectContaining({
        id: 4,
        licensePlate: 'ABC1D23',
        processedAt: expect.any(Date),
      }),
    ]);
    expect(transaction).not.toHaveBeenCalled();
  });

  it('starts a transaction when no runner is supplied', async () => {
    const { provider, runner, transaction } = createSubject();
    runner.manager.save.mockResolvedValue([{ id: 4 }]);

    await provider.execute({ ids: [4], queryRunner: undefined });

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(runner.manager.save).toHaveBeenCalledWith([
      expect.objectContaining({ id: 4, processedAt: expect.any(Date) }),
    ]);
  });

  it('saves an empty result as an empty batch', async () => {
    const { provider, runner } = createSubject([]);
    runner.manager.save.mockResolvedValue([]);

    await expect(
      provider.execute({
        ids: [],
        queryRunner: runner as unknown as QueryRunner,
      }),
    ).resolves.toEqual([]);
    expect(runner.manager.save).toHaveBeenCalledWith(PlateReadingEntity, []);
  });

  it('preserves the original missing-readings error', async () => {
    const { provider } = createSubject(null);

    await expect(
      provider.execute({ ids: [4], queryRunner: undefined }),
    ).rejects.toMatchObject({
      message: 'Leituras de placas não encontrada',
      status: 404,
    });
  });

  it('propagates save failures to the transaction owner', async () => {
    const { provider, runner } = createSubject();
    const failure = new Error('save failed');
    runner.manager.save.mockRejectedValue(failure);

    await expect(
      provider.execute({
        ids: [4],
        queryRunner: runner as unknown as QueryRunner,
      }),
    ).rejects.toBe(failure);
  });
});

describe('ProcessorPlateReadingProvider', () => {
  const createSubject = (readings: unknown[] = []) => {
    const runner = {} as QueryRunner;
    const findMany = jest
      .fn<() => Promise<unknown[]>>()
      .mockResolvedValue(readings);
    const update = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue(undefined);
    const createVehicle = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue({ id: 8, isServiceVehicle: false });
    const upsert = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue(undefined);
    const transaction = jest
      .fn<
        (work: (query: QueryRunner) => Promise<unknown>) => Promise<unknown>
      >()
      .mockImplementation((work) => work(runner));
    const provider = new ProcessorPlateReadingProvider(
      {
        findMany: { execute: findMany },
        update: { execute: update },
      } as unknown as PlateReadingService,
      { createIa: { execute: createVehicle } } as unknown as VehicleService,
      { upsertIa: { execute: upsert } } as unknown as ParkingRecordService,
      { transaction } as unknown as PlateReadingRepository,
    );
    return {
      provider,
      runner,
      findMany,
      update,
      createVehicle,
      upsert,
      transaction,
    };
  };
  const reading = {
    id: 3,
    licensePlate: 'ABC1D23',
    createdAt: new Date('2026-01-01T12:00:00Z'),
  };

  it('avoids opening a transaction for an empty batch', async () => {
    const { provider, transaction, createVehicle, update } = createSubject();

    await expect(provider.execute()).resolves.toEqual({
      message: 'Nenhum dado para atualizar',
    });
    expect(transaction).not.toHaveBeenCalled();
    expect(createVehicle).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('processes readings sequentially using the same transaction', async () => {
    const { provider, runner, createVehicle, upsert, update } = createSubject([
      reading,
      { ...reading, id: 4 },
    ]);

    await expect(provider.execute()).resolves.toEqual({
      message: 'Dados atualizados com sucesso',
    });
    expect(createVehicle).toHaveBeenNthCalledWith(1, {
      dto: { licensePlate: 'ABC1D23' },
      queryRunner: runner,
    });
    expect(upsert).toHaveBeenNthCalledWith(1, {
      dto: {
        vehicle: { id: 8, isServiceVehicle: false },
        entryTime: reading.createdAt,
        entryReadingId: 3,
      },
      dtoUpdate: {
        vehicle: { id: 8, isServiceVehicle: false },
        entryTime: reading.createdAt,
        entryReadingId: 3,
        exitTime: reading.createdAt,
        exitReadingId: 3,
      },
      queryRunner: runner,
    });
    expect(update).toHaveBeenCalledWith({ ids: [3, 4], queryRunner: runner });
    expect(createVehicle.mock.invocationCallOrder[0]).toBeLessThan(
      upsert.mock.invocationCallOrder[0],
    );
    expect(upsert.mock.invocationCallOrder[0]).toBeLessThan(
      createVehicle.mock.invocationCallOrder[1],
    );
    expect(upsert.mock.invocationCallOrder[1]).toBeLessThan(
      update.mock.invocationCallOrder[0],
    );
  });

  it.each([null, { id: 8, isServiceVehicle: true }, { id: 8 }])(
    'skips parking for ineligible vehicle %p but marks readings',
    async (vehicle) => {
      const { provider, createVehicle, upsert, update } = createSubject([
        reading,
      ]);
      createVehicle.mockResolvedValue(vehicle);

      await provider.execute();

      expect(upsert).not.toHaveBeenCalled();
      expect(update).toHaveBeenCalledTimes(1);
    },
  );

  it('converts a transaction failure into the original HTTP error', async () => {
    const { provider, upsert, update } = createSubject([reading]);
    upsert.mockRejectedValue(new Error('save failed'));

    await expect(provider.execute()).rejects.toMatchObject({
      message: 'Falha ao processar as leituras de placa',
      status: 404,
    });
    expect(update).not.toHaveBeenCalled();
  });

  it('preserves a lookup failure outside the transaction error boundary', async () => {
    const { provider, findMany, transaction } = createSubject();
    const failure = new Error('lookup failed');
    findMany.mockRejectedValue(failure);

    await expect(provider.execute()).rejects.toBe(failure);
    expect(transaction).not.toHaveBeenCalled();
  });
});

describe('TaskProvider', () => {
  const createSubject = () => {
    const execute = jest
      .fn<() => Promise<{ message: string }>>()
      .mockResolvedValue({ message: 'done' });
    const provider = new TaskProvider({
      processor: { execute },
    } as unknown as PlateReadingService);
    const invoke = () =>
      (provider as unknown as { handleCron(): Promise<void> }).handleCron();
    return { execute, invoke };
  };

  it('runs the processor and logs its result', async () => {
    const { execute, invoke } = createSubject();

    await invoke();

    expect(execute).toHaveBeenCalledTimes(1);
    expect(Logger.prototype.log).toHaveBeenCalledWith('done');
  });

  it('skips overlap and permits execution after completion', async () => {
    const { execute, invoke } = createSubject();
    let finish: (result: { message: string }) => void;
    execute.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const first = invoke();

    await invoke();
    expect(execute).toHaveBeenCalledTimes(1);
    finish({ message: 'done' });
    await first;
    await invoke();
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it('logs failures and releases the overlap lock for the next run', async () => {
    const { execute, invoke } = createSubject();
    const failure = new Error('processor failed');
    execute.mockRejectedValueOnce(failure);

    await expect(invoke()).resolves.toBeUndefined();
    expect(Logger.prototype.error).toHaveBeenCalledWith(
      'Falha ao executar o job via CRON',
      failure.stack,
    );
    await invoke();
    expect(execute).toHaveBeenCalledTimes(2);
  });
});
