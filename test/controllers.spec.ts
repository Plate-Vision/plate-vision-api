import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';
import { DefaultParkingRecordController } from '@modules/parking-record/application/controllers/routes/default-parking-record.controller';
import { DefaultVehicleController } from '@modules/vehicle/application/controllers/routes/default-vehicle.route';
import { DefaultCustomerController } from '@modules/customer/application/controllers/routes/default-customer.route';
import { DefaultPlateReadingController } from '@modules/plate-reading/application/controllers/routes/default-plate-reading.route';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { PlateReadingService } from '@modules/plate-reading/domain/services/plate-reading.service';
import { AuthGuard } from '@modules/auth/domain/guards/auth.guard';
import { RoleGuard } from '@modules/auth/domain/guards/role.guard';
import { AbilityGuard } from '@modules/auth/domain/guards/ability.guard';

const createService = () => ({
  findMany: {
    execute: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue({ data: [] }),
  },
  findOne: {
    execute: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue({ id: 1 }),
  },
  create: {
    execute: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue({ id: 2 }),
  },
  update: {
    execute: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue({ id: 3 }),
  },
  delete: {
    execute: jest
      .fn<(...args: unknown[]) => Promise<unknown>>()
      .mockResolvedValue({ message: 'deleted' }),
  },
});
type ServiceStub = ReturnType<typeof createService>;
interface CrudController {
  findMany(dto: unknown): Promise<unknown>;
  findOne(uuid: string): Promise<unknown>;
  create(dto: unknown, user: unknown): Promise<unknown>;
  update(uuid: string, dto: unknown, user: unknown): Promise<unknown>;
  delete(uuid: string): Promise<unknown>;
}

const controllers = [
  {
    name: 'parking',
    path: 'parkings',
    type: DefaultParkingRecordController,
    create: (service: ServiceStub) =>
      new DefaultParkingRecordController(
        service as unknown as ParkingRecordService,
      ),
    uuidArgument: { uuid: 'record-uuid' },
  },
  {
    name: 'vehicle',
    path: 'vehicles',
    type: DefaultVehicleController,
    create: (service: ServiceStub) =>
      new DefaultVehicleController(service as unknown as VehicleService),
    uuidArgument: 'record-uuid',
  },
  {
    name: 'customer',
    path: 'clientes',
    type: DefaultCustomerController,
    create: (service: ServiceStub) =>
      new DefaultCustomerController(service as unknown as CustomerService),
    uuidArgument: { uuid: 'record-uuid' },
  },
];

describe.each(controllers)(
  '$name controller',
  ({ create, uuidArgument, type, path }) => {
    const createSubject = () => {
      const service = createService();
      const controller = create(service) as CrudController;
      return { service, controller };
    };

    it('preserves route and authentication guard metadata', () => {
      expect(Reflect.getMetadata(PATH_METADATA, type)).toBe(path);
      expect(Reflect.getMetadata(GUARDS_METADATA, type)).toEqual([
        AuthGuard,
        RoleGuard,
        AbilityGuard,
      ]);
      expect(
        Reflect.getMetadata(METHOD_METADATA, type.prototype.findMany),
      ).toBe(RequestMethod.GET);
      expect(Reflect.getMetadata(PATH_METADATA, type.prototype.findOne)).toBe(
        '/:uuid',
      );
    });

    it('forwards pagination filters and returns the list payload', async () => {
      const { service, controller } = createSubject();
      const dto = { take: 10, skip: 2 };
      expect(await controller.findMany(dto)).toEqual({ data: [] });
      expect(service.findMany.execute).toHaveBeenCalledWith({ dto });
    });

    it('preserves the find-one argument shape', async () => {
      const { service, controller } = createSubject();
      expect(await controller.findOne('record-uuid')).toEqual({ id: 1 });
      expect(service.findOne.execute).toHaveBeenCalledWith(uuidArgument);
    });

    it('passes the request body and authenticated user on creation', async () => {
      const { service, controller } = createSubject();
      const dto = { name: 'sample' };
      const authUser = { id: 7 };
      expect(await controller.create(dto, authUser)).toEqual({ id: 2 });
      expect(service.create.execute).toHaveBeenCalledWith({ dto, authUser });
    });

    it('passes the UUID, changes and user on update', async () => {
      const { service, controller } = createSubject();
      const data = { name: 'updated' };
      const authUser = { id: 7 };
      expect(await controller.update('record-uuid', data, authUser)).toEqual({
        id: 3,
      });
      expect(service.update.execute).toHaveBeenCalledWith({
        uuid: 'record-uuid',
        data,
        authUser,
      });
    });

    it('forwards deletion and preserves service failures', async () => {
      const { service, controller } = createSubject();
      expect(await controller.delete('record-uuid')).toEqual({
        message: 'deleted',
      });
      expect(service.delete.execute).toHaveBeenCalledWith({
        uuid: 'record-uuid',
      });
      const failure = new Error('not found');
      service.delete.execute.mockRejectedValue(failure);
      await expect(controller.delete('record-uuid')).rejects.toBe(failure);
    });
  },
);

describe('Plate reading controller', () => {
  it('retains its authenticated route and returns processor output', async () => {
    const result = { message: 'Dados atualizados com sucesso' };
    const execute = jest.fn<() => Promise<unknown>>().mockResolvedValue(result);
    const controller = new DefaultPlateReadingController({
      processor: { execute },
    } as unknown as PlateReadingService);

    expect(await controller.processor()).toBe(result);
    expect(execute).toHaveBeenCalledWith();
    expect(
      Reflect.getMetadata(PATH_METADATA, DefaultPlateReadingController),
    ).toBe('plates/readings');
    expect(
      Reflect.getMetadata(GUARDS_METADATA, DefaultPlateReadingController),
    ).toEqual([AuthGuard, RoleGuard, AbilityGuard]);
  });
});
