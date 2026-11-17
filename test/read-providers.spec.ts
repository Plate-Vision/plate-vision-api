import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { ILike, QueryRunner } from 'typeorm';
import { FindOneVehicleProvider } from '@modules/vehicle/domain/services/providers/find-one-vehicle.provider';
import { FindOneCustomerProvider } from '@modules/customer/domain/services/providers/find-one-customer.provider';
import { FindOneParkingRecordProvider } from '@modules/parking-record/domain/services/providers/find-one-parking-record.provider';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';

const uuid = '123e4567-e89b-42d3-a456-426614174000';
const createManager = () => ({
  findOne: jest
    .fn<(...args: unknown[]) => Promise<unknown>>()
    .mockResolvedValue({ id: 1 }),
});
const providers = [
  {
    name: 'vehicle',
    message: 'Veículo não encontrado',
    create: (manager: ReturnType<typeof createManager>) =>
      new FindOneVehicleProvider({ manager } as unknown as VehicleRepository),
    find: (provider: unknown, value: string) =>
      (provider as FindOneVehicleProvider).execute(value),
  },
  {
    name: 'customer',
    message: 'Cliente não encontrado',
    create: (manager: ReturnType<typeof createManager>) =>
      new FindOneCustomerProvider({ manager } as unknown as CustomerRepository),
    find: (provider: unknown, value: string) =>
      (provider as FindOneCustomerProvider).execute({ uuid: value }),
  },
  {
    name: 'parking',
    message: 'Registro não encontrado',
    create: (manager: ReturnType<typeof createManager>) =>
      new FindOneParkingRecordProvider({
        manager,
      } as unknown as ParkingRecordRepository),
    find: (provider: unknown, value: string) =>
      (provider as FindOneParkingRecordProvider).execute({ uuid: value }),
  },
];

describe.each(providers)('$name read provider', ({ create, find, message }) => {
  it('rejects an invalid UUID without querying storage', async () => {
    const manager = createManager();
    await expect(find(create(manager), 'invalid')).rejects.toMatchObject({
      status: 404,
      message,
    });
    expect(manager.findOne).not.toHaveBeenCalled();
  });

  it('queries by UUID and returns the existing entity', async () => {
    const manager = createManager();
    expect(await find(create(manager), uuid)).toEqual({ id: 1 });
    expect(manager.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { uuid },
        relations: expect.any(Array),
      }),
    );
  });

  it('rejects a missing UUID result', async () => {
    const manager = createManager();
    manager.findOne.mockResolvedValue(null);
    await expect(find(create(manager), uuid)).rejects.toMatchObject({
      status: 404,
      message,
    });
  });

  it('finds by ID with the repository outside a transaction', async () => {
    const manager = createManager();
    expect(await create(manager).executeById({ id: 1 })).toEqual({ id: 1 });
    expect(manager.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('uses the supplied runner and rejects missing IDs', async () => {
    const manager = createManager();
    const transactionalManager = createManager();
    const provider = create(manager);
    const queryRunner = {
      manager: transactionalManager,
    } as unknown as QueryRunner;
    expect(await provider.executeById({ id: 1, queryRunner })).toEqual({
      id: 1,
    });
    expect(manager.findOne).not.toHaveBeenCalled();
    transactionalManager.findOne.mockResolvedValue(null);
    await expect(
      provider.executeById({ id: 1, queryRunner }),
    ).rejects.toMatchObject({ status: 404, message });
  });
});

describe('Vehicle license plate lookup', () => {
  it('matches plates case-insensitively and returns undefined when absent', async () => {
    const manager = createManager();
    const provider = new FindOneVehicleProvider({
      manager,
    } as unknown as VehicleRepository);
    expect(await provider.executeByLicensePlate('abc1d23')).toEqual({ id: 1 });
    expect(manager.findOne).toHaveBeenCalledWith({
      where: { licensePlate: ILike('abc1d23') },
    });
    manager.findOne.mockResolvedValue(null);
    expect(await provider.executeByLicensePlate('none')).toBeUndefined();
  });
});

describe('Latest parking record lookup', () => {
  it.each([false, true])(
    'uses transaction=%p and orders the last vehicle record by descending ID',
    async (transactional) => {
      const manager = createManager();
      const provider = new FindOneParkingRecordProvider({
        manager,
      } as unknown as ParkingRecordRepository);
      const runner = transactional
        ? ({ manager } as unknown as QueryRunner)
        : undefined;
      expect(await provider.executeByLastOneVehicle(4, runner)).toEqual({
        id: 1,
      });
      const criteria = { where: { vehicle: { id: 4 } }, order: { id: 'DESC' } };
      expect(manager.findOne).toHaveBeenCalledWith(
        ...(transactional ? [expect.anything(), criteria] : [criteria]),
      );
      manager.findOne.mockResolvedValue(null);
      expect(await provider.executeByLastOneVehicle(4, runner)).toBeUndefined();
    },
  );
});
