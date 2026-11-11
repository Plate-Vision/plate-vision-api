import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { QueryRunner } from 'typeorm';
import { CreateVehicleIaProvider } from '@modules/vehicle/domain/services/providers/create-vehicle-ia.provider';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { EVehicleSource } from '@modules/vehicle/domain/enums/vehicle-source.enum';

const createSubject = () => {
  const save = jest
    .fn<(entity: unknown, data?: unknown) => Promise<unknown>>()
    .mockImplementation(async (_entity, data) => data);
  const runner = { manager: { save } };
  const transaction = jest
    .fn<(work: (query: unknown) => Promise<unknown>) => Promise<unknown>>()
    .mockImplementation((work) => work(runner));
  const findOne = jest
    .fn<() => Promise<unknown>>()
    .mockResolvedValue(undefined);
  const provider = new CreateVehicleIaProvider(
    { transaction } as unknown as VehicleRepository,
    {
      findOne: { executeByLicensePlate: findOne },
    } as unknown as VehicleService,
  );
  return { provider, save, runner, transaction, findOne };
};

describe('CreateVehicleIaProvider', () => {
  const dto = { licensePlate: 'abc1d23' };

  it('reuses an existing vehicle without saving', async () => {
    const { provider, findOne, save, transaction } = createSubject();
    const vehicle = { id: 2, licensePlate: 'ABC1D23' };
    findOne.mockResolvedValue(vehicle);

    expect(await provider.execute({ dto })).toBe(vehicle);
    expect(findOne).toHaveBeenCalledWith('abc1d23', undefined);
    expect(save).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('normalizes the new plate and records AI as its source', async () => {
    const { provider, save, transaction } = createSubject();

    expect(await provider.execute({ dto })).toEqual({
      licensePlate: 'ABC1D23',
      source: EVehicleSource.AI,
    });
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(VehicleEntity, {
      licensePlate: 'ABC1D23',
      source: EVehicleSource.AI,
    });
  });

  it('uses the caller runner for lookup and save', async () => {
    const { provider, runner, transaction, findOne } = createSubject();

    await provider.execute({
      dto,
      queryRunner: runner as unknown as QueryRunner,
    });

    expect(findOne).toHaveBeenCalledWith('abc1d23', runner);
    expect(transaction).not.toHaveBeenCalled();
  });

  it('propagates lookup failures without opening a transaction', async () => {
    const { provider, findOne, transaction } = createSubject();
    const failure = new Error('lookup failed');
    findOne.mockRejectedValue(failure);

    await expect(provider.execute({ dto })).rejects.toBe(failure);
    expect(transaction).not.toHaveBeenCalled();
  });

  it('propagates save failures to the transaction owner', async () => {
    const { provider, save } = createSubject();
    const failure = new Error('save failed');
    save.mockRejectedValue(failure);

    await expect(provider.execute({ dto })).rejects.toBe(failure);
  });
});
