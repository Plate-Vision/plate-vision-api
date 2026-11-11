import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { DeleteParkingRecordProvider } from '@modules/parking-record/domain/services/providers/delete-parking-record.provider';
import { DeleteVehicleProvider } from '@modules/vehicle/domain/services/providers/delete-vehicle.provider';
import { DeleteCustomerProvider } from '@modules/customer/domain/services/providers/delete-customer.provider';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CustomerRepository } from '@modules/customer/infra/repositories/customer.repository';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { ParkingRecordEntity } from '@modules/parking-record/domain/entities/parking-record.entity';
import { VehicleEntity } from '@modules/vehicle/domain/entities/vehicle.entity';
import { CustomerEntity } from '@modules/customer/domain/entities/customer.entity';

const createDependencies = () => {
  const softDelete = jest
    .fn<() => Promise<unknown>>()
    .mockResolvedValue(undefined);
  const transaction = jest
    .fn<(work: (runner: unknown) => Promise<unknown>) => Promise<unknown>>()
    .mockImplementation((work) => work({ manager: { softDelete } }));
  const execute = jest
    .fn<() => Promise<unknown>>()
    .mockResolvedValue({ id: 7, uuid: 'record-uuid' });
  return {
    softDelete,
    transaction,
    execute,
    repository: { transaction },
    service: { findOne: { execute } },
  };
};
type Dependencies = ReturnType<typeof createDependencies>;
const providers = [
  {
    name: 'parking',
    entity: ParkingRecordEntity,
    criteria: { id: 7 },
    message: 'Registro deletado com sucesso',
    create: (d: Dependencies) =>
      new DeleteParkingRecordProvider(
        d.repository as unknown as ParkingRecordRepository,
        d.service as unknown as ParkingRecordService,
      ),
  },
  {
    name: 'vehicle',
    entity: VehicleEntity,
    criteria: { uuid: 'record-uuid' },
    message: 'Veículo deletado com sucesso',
    create: (d: Dependencies) =>
      new DeleteVehicleProvider(
        d.repository as unknown as VehicleRepository,
        d.service as unknown as VehicleService,
      ),
  },
  {
    name: 'customer',
    entity: CustomerEntity,
    criteria: { id: 7 },
    message: 'Cliente deletado com sucesso',
    create: (d: Dependencies) =>
      new DeleteCustomerProvider(
        d.repository as unknown as CustomerRepository,
        d.service as unknown as CustomerService,
      ),
  },
];

describe.each(providers)(
  '$name deletion',
  ({ create, entity, criteria, message }) => {
    it('soft deletes the located entity in a transaction', async () => {
      const dependencies = createDependencies();
      expect(
        await create(dependencies).execute({ uuid: 'record-uuid' }),
      ).toEqual({ message });
      expect(dependencies.softDelete).toHaveBeenCalledWith(entity, criteria);
      expect(dependencies.transaction).toHaveBeenCalledTimes(1);
      expect(dependencies.execute.mock.invocationCallOrder[0]).toBeLessThan(
        dependencies.transaction.mock.invocationCallOrder[0],
      );
    });

    it('does not start a transaction when lookup fails', async () => {
      const dependencies = createDependencies();
      const failure = new Error('not found');
      dependencies.execute.mockRejectedValue(failure);
      await expect(
        create(dependencies).execute({ uuid: 'record-uuid' }),
      ).rejects.toBe(failure);
      expect(dependencies.transaction).not.toHaveBeenCalled();
    });

    it('propagates deletion failures instead of reporting success', async () => {
      const dependencies = createDependencies();
      const failure = new Error('delete failed');
      dependencies.softDelete.mockRejectedValue(failure);
      await expect(
        create(dependencies).execute({ uuid: 'record-uuid' }),
      ).rejects.toBe(failure);
    });
  },
);
