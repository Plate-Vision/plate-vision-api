import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { QueryRunner } from 'typeorm';
import { CreateParkingRecordManualProvider } from '@modules/parking-record/domain/services/providers/create-parking-record-manual.provider';
import { UpdateParkingRecordManualProvider } from '@modules/parking-record/domain/services/providers/update-parking-record-manual.provider';
import { UpdateParkingRecordIaProvider } from '@modules/parking-record/domain/services/providers/update-parking-record-ia.provider';
import { UpsertParkingRecordIaProvider } from '@modules/parking-record/domain/services/providers/upsert-parking-record-ia.provider';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { FindOneParkingRecordProvider } from '@modules/parking-record/domain/services/providers/find-one-parking-record.provider';
import { ParkingRecordEntity } from '@modules/parking-record/domain/entities/parking-record.entity';
import { EParkingRecordSource } from '@modules/parking-record/domain/enums/parking-record-source.enum';
import { CreateParkingRecordDTO } from '@modules/parking-record/domain/dtos/create-parking-record.dto';
import { UpdateParkingRecordDTO } from '@modules/parking-record/domain/dtos/update-parking-record.dto';
import { FindOneVehicleProvider } from '@modules/vehicle/domain/services/providers/find-one-vehicle.provider';
import { EVehicleStatus } from '@modules/vehicle/domain/enums/vehicle-status.enum';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

const entryTime = new Date('2026-01-01T12:00:00Z');
const exitTime = new Date('2026-01-01T13:00:00Z');
const earlierTime = new Date('2026-01-01T11:00:00Z');
const authUser = { id: 7 } as UserEntity;
const dto = { vehicle: { id: 2 }, entryTime } as CreateParkingRecordDTO;
const originalRecord = {
  id: 3,
  uuid: 'record-uuid',
  entryTime,
  exitTime: null,
  entryReading: { id: 9 },
  exitReading: null,
} as ParkingRecordEntity;
const dateError = {
  message:
    'A data e hora de saída não pode ser menor que a data e hora de entrada',
  status: 412,
};

const createPersistence = () => {
  const save = jest
    .fn<(entity: unknown, data?: unknown) => Promise<unknown>>()
    .mockImplementation(async (entity, data) => data ?? entity);
  const runner = {
    manager: {
      save,
      findOne: jest.fn<() => Promise<unknown>>().mockResolvedValue(null),
    },
  };
  const transaction = jest
    .fn<(work: (query: unknown) => Promise<unknown>) => Promise<unknown>>()
    .mockImplementation((work) => work(runner));
  const repository = { transaction } as unknown as ParkingRecordRepository;
  return { save, runner, transaction, repository };
};

describe('CreateParkingRecordManualProvider', () => {
  const createSubject = () => {
    const persistence = createPersistence();
    const findVehicle = jest.fn<() => Promise<unknown>>().mockResolvedValue({
      id: 2,
      status: EVehicleStatus.ACTIVE,
      isServiceVehicle: false,
    });
    const findLast = jest.fn<() => Promise<unknown>>().mockResolvedValue(null);
    const provider = new CreateParkingRecordManualProvider(
      persistence.repository,
      { executeById: findVehicle } as unknown as FindOneVehicleProvider,
      {
        executeByLastOneVehicle: findLast,
      } as unknown as FindOneParkingRecordProvider,
    );
    return { ...persistence, findVehicle, findLast, provider };
  };

  it('saves a manual entry in its own transaction', async () => {
    const { provider, findVehicle, findLast, transaction, save } =
      createSubject();

    const result = await provider.execute({ dto, authUser });

    expect(findVehicle).toHaveBeenCalledWith({ id: 2 });
    expect(findLast).toHaveBeenCalledWith(2);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(ParkingRecordEntity, {
      ...dto,
      userCreated: authUser,
      entrySource: EParkingRecordSource.MA,
      exitSource: null,
    });
    expect(result).toEqual(
      expect.objectContaining({ entryTime, exitSource: null }),
    );
  });

  it('uses an existing transaction and records a manual exit source', async () => {
    const { provider, runner, transaction, save } = createSubject();

    await provider.execute({
      dto: { ...dto, exitTime },
      authUser,
      queryRunner: runner as unknown as QueryRunner,
    });

    expect(transaction).not.toHaveBeenCalled();
    expect(save).toHaveBeenCalledWith(
      ParkingRecordEntity,
      expect.objectContaining({
        exitTime,
        exitSource: EParkingRecordSource.MA,
      }),
    );
  });

  it('rejects an inactive vehicle before checking parking records', async () => {
    const { provider, findVehicle, findLast, save } = createSubject();
    findVehicle.mockResolvedValue({ id: 2, status: EVehicleStatus.INACTIVE });

    await expect(provider.execute({ dto, authUser })).rejects.toMatchObject({
      message: 'Veículo inativo',
      status: 422,
    });
    expect(findLast).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects a service vehicle', async () => {
    const { provider, findVehicle, save } = createSubject();
    findVehicle.mockResolvedValue({ id: 2, isServiceVehicle: true });

    await expect(provider.execute({ dto, authUser })).rejects.toMatchObject({
      message:
        'Não é possível registrar entrada ou saída de um veículo de serviço',
      status: 422,
    });
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects an exit before entry', async () => {
    const { provider, findLast } = createSubject();

    await expect(
      provider.execute({ dto: { ...dto, exitTime: earlierTime }, authUser }),
    ).rejects.toMatchObject(dateError);
    expect(findLast).not.toHaveBeenCalled();
  });

  it('accepts equal entry and exit dates', async () => {
    const { provider, save } = createSubject();

    await provider.execute({ dto: { ...dto, exitTime: entryTime }, authUser });
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('rejects a previous parking record with a null exit', async () => {
    const { provider, findLast } = createSubject();
    findLast.mockResolvedValue(originalRecord);

    await expect(provider.execute({ dto, authUser })).rejects.toMatchObject({
      message:
        'Já existe um registro para esse veículo sem data e hora de saída',
      status: 422,
    });
  });

  it.each([exitTime, undefined])(
    'preserves acceptance of a previous exit %p',
    async (previousExit) => {
      const { provider, findLast, save } = createSubject();
      findLast.mockResolvedValue({ ...originalRecord, exitTime: previousExit });

      await provider.execute({ dto, authUser });
      expect(save).toHaveBeenCalledTimes(1);
    },
  );

  it('propagates save failures', async () => {
    const { provider, save } = createSubject();
    const failure = new Error('save failed');
    save.mockRejectedValue(failure);

    await expect(provider.execute({ dto, authUser })).rejects.toBe(failure);
  });
});

describe('UpdateParkingRecordManualProvider', () => {
  const createSubject = (record = originalRecord) => {
    const persistence = createPersistence();
    const findOne = jest.fn<() => Promise<unknown>>().mockResolvedValue(record);
    const provider = new UpdateParkingRecordManualProvider(
      persistence.repository,
      { execute: findOne } as unknown as FindOneParkingRecordProvider,
    );
    const execute = (data: Partial<UpdateParkingRecordDTO>) =>
      provider.execute({
        uuid: 'record-uuid',
        data: data as UpdateParkingRecordDTO,
        authUser,
      });
    return { ...persistence, provider, findOne, execute };
  };

  it('updates the record, tracks the user and marks the source manual', async () => {
    const { execute, save, findOne } = createSubject();

    const result = await execute({ exitTime });

    expect(findOne).toHaveBeenCalledWith({ uuid: 'record-uuid' });
    expect(save).toHaveBeenCalledWith(expect.any(ParkingRecordEntity));
    expect(result).toEqual(
      expect.objectContaining({
        id: 3,
        exitTime,
        userUpdated: authUser,
        exitSource: EParkingRecordSource.MA,
      }),
    );
  });

  it('preserves the original clearing of an omitted exit date', async () => {
    const { execute } = createSubject({ ...originalRecord, exitTime });

    expect(await execute({})).toEqual(
      expect.objectContaining({ exitTime: null }),
    );
  });

  it('allows explicit null to clear exit even when the stored dates would conflict', async () => {
    const { execute } = createSubject({
      ...originalRecord,
      exitTime: earlierTime,
    });

    expect(await execute({ exitTime: null })).toEqual(
      expect.objectContaining({ exitTime: null }),
    );
  });

  it('checks an omitted exit against the original date before clearing it', async () => {
    const { execute, save } = createSubject({
      ...originalRecord,
      exitTime: earlierTime,
    });

    await expect(execute({})).rejects.toMatchObject(dateError);
    expect(save).not.toHaveBeenCalled();
  });

  it('checks an updated entry against a stored exit', async () => {
    const { execute } = createSubject({ ...originalRecord, exitTime });

    await expect(
      execute({ entryTime: new Date('2026-01-01T14:00:00Z') }),
    ).rejects.toMatchObject(dateError);
  });

  it('rejects an earlier exit date without saving', async () => {
    const { execute, save } = createSubject();

    await expect(execute({ exitTime: earlierTime })).rejects.toMatchObject(
      dateError,
    );
    expect(save).not.toHaveBeenCalled();
  });

  it('propagates a lookup failure without starting a transaction', async () => {
    const { execute, findOne, transaction } = createSubject();
    const failure = new Error('not found');
    findOne.mockRejectedValue(failure);

    await expect(execute({ exitTime })).rejects.toBe(failure);
    expect(transaction).not.toHaveBeenCalled();
  });
});

describe('UpdateParkingRecordIaProvider', () => {
  const createSubject = (record = originalRecord) => {
    const persistence = createPersistence();
    const findOne = jest.fn<() => Promise<unknown>>().mockResolvedValue(record);
    const provider = new UpdateParkingRecordIaProvider({
      executeById: findOne,
    } as unknown as FindOneParkingRecordProvider);
    const execute = (
      data: Partial<UpdateParkingRecordDTO>,
      queryRunner: QueryRunner = persistence.runner as unknown as QueryRunner,
    ) =>
      provider.execute({
        id: 3,
        data: data as UpdateParkingRecordDTO,
        queryRunner,
      });
    return { ...persistence, provider, findOne, execute };
  };

  it('keeps original entry fields while setting the AI exit', async () => {
    const { execute, save, runner, findOne } = createSubject();

    const result = await execute({
      entryTime: earlierTime,
      entryReadingId: 100,
      exitTime,
      exitReadingId: 10,
    });

    expect(findOne).toHaveBeenCalledWith({ id: 3, queryRunner: runner });
    expect(save).toHaveBeenCalledWith(
      ParkingRecordEntity,
      expect.objectContaining({
        entryTime,
        entryReading: { id: 9 },
        exitTime,
        exitReading: { id: 10 },
        exitSource: EParkingRecordSource.AI,
      }),
    );
    expect(result.entryTime).toBe(entryTime);
  });

  it.each([undefined, 0, null])(
    'keeps the original exit reading for falsy id %p',
    async (exitReadingId) => {
      const record = {
        ...originalRecord,
        exitReading: { id: 10 },
      } as ParkingRecordEntity;
      const { execute } = createSubject(record);

      expect(await execute({ exitTime, exitReadingId })).toEqual(
        expect.objectContaining({ exitReading: { id: 10 } }),
      );
    },
  );

  it('rejects dates before the original entry', async () => {
    const { execute, save } = createSubject();

    await expect(execute({ exitTime: earlierTime })).rejects.toMatchObject(
      dateError,
    );
    expect(save).not.toHaveBeenCalled();
  });

  it('uses the stored exit when a new exit is null', async () => {
    const { execute } = createSubject({
      ...originalRecord,
      exitTime: earlierTime,
    });

    await expect(execute({ exitTime: null })).rejects.toMatchObject(dateError);
  });

  it('preserves the no-runner behavior without saving', async () => {
    const { provider, save } = createSubject();

    await expect(
      provider.execute({ id: 3, data: { exitTime } as UpdateParkingRecordDTO }),
    ).resolves.toBeUndefined();
    expect(save).not.toHaveBeenCalled();
  });
});

describe('UpsertParkingRecordIaProvider', () => {
  const createSubject = () => {
    const persistence = createPersistence();
    const update = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue({ id: 3, exitTime });
    const provider = new UpsertParkingRecordIaProvider(persistence.repository, {
      execute: update,
    } as unknown as UpdateParkingRecordIaProvider);
    const execute = () =>
      provider.execute({
        dto: { ...dto, entryReadingId: 9 },
        dtoUpdate: { ...dto, exitTime, exitReadingId: 10 },
        queryRunner: persistence.runner as unknown as QueryRunner,
      });
    return { ...persistence, provider, update, execute };
  };

  it('creates an AI entry when no parking record exists', async () => {
    const { execute, runner, transaction, save, update } = createSubject();

    await execute();

    expect(runner.manager.findOne).toHaveBeenCalledWith(ParkingRecordEntity, {
      where: { vehicle: { id: 2 } },
      order: { id: 'DESC' },
    });
    expect(save).toHaveBeenCalledWith(
      ParkingRecordEntity,
      expect.objectContaining({
        vehicle: dto.vehicle,
        entryTime,
        entryReading: { id: 9 },
        entrySource: EParkingRecordSource.AI,
      }),
    );
    expect(update).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('closes the latest open record using the same transaction', async () => {
    const { execute, runner, save, update } = createSubject();
    runner.manager.findOne.mockResolvedValue(originalRecord);

    expect(await execute()).toEqual({ id: 3, exitTime });
    expect(update).toHaveBeenCalledWith({
      id: 3,
      data: { ...dto, exitTime, exitReadingId: 10 },
      queryRunner: runner,
    });
    expect(save).not.toHaveBeenCalled();
  });

  it.each([exitTime, undefined])(
    'creates a new entry when latest exit is %p',
    async (previousExit) => {
      const { execute, runner, save, update } = createSubject();
      runner.manager.findOne.mockResolvedValue({
        ...originalRecord,
        exitTime: previousExit,
      });

      await execute();

      expect(save).toHaveBeenCalledTimes(1);
      expect(update).not.toHaveBeenCalled();
    },
  );

  it('preserves the original TypeError when a runner is omitted', async () => {
    const { provider, transaction, save } = createSubject();

    await expect(
      provider.execute({ dto, dtoUpdate: { ...dto, exitTime } }),
    ).rejects.toBeInstanceOf(TypeError);
    expect(transaction).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('propagates an update failure without creating another record', async () => {
    const { execute, runner, update, save } = createSubject();
    runner.manager.findOne.mockResolvedValue(originalRecord);
    const failure = new Error('update failed');
    update.mockRejectedValue(failure);

    await expect(execute()).rejects.toBe(failure);
    expect(save).not.toHaveBeenCalled();
  });
});
