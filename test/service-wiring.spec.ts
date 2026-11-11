import 'reflect-metadata';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { QueryRunner } from 'typeorm';
import { VehicleService } from '@modules/vehicle/domain/services/vehicle.service';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { CustomerService } from '@modules/customer/domain/services/customer.service';
import { ParkingRecordService } from '@modules/parking-record/domain/services/parking-record.service';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { ParkingRecordEntity } from '@modules/parking-record/domain/entities/parking-record.entity';
import { PlateReadingService } from '@modules/plate-reading/domain/services/plate-reading.service';
import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { PlateReadingEntity } from '@modules/plate-reading/domain/entities/plate-reading.entity';
import { EParkingRecordSource } from '@modules/parking-record/domain/enums/parking-record-source.enum';

afterEach(() => jest.restoreAllMocks());

describe('Service composition', () => {
  it('processes an AI entry through the real vehicle, parking and reading providers', async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    const reading = {
      id: 1,
      licensePlate: 'ABC1D23',
      createdAt: new Date('2026-01-01T12:00:00Z'),
    };
    const vehicle = { id: 2, licensePlate: 'ABC1D23', isServiceVehicle: false };
    const findVehicle = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue(vehicle);
    const save = jest
      .fn<(entity: unknown, data: unknown) => Promise<unknown>>()
      .mockImplementation(async (_entity, data) => data);
    const runner = {
      manager: {
        findOne: jest
          .fn<() => Promise<unknown>>()
          .mockResolvedValueOnce(vehicle)
          .mockResolvedValue(null),
        save,
      },
    };
    const transaction = jest
      .fn<
        (work: (query: QueryRunner) => Promise<unknown>) => Promise<unknown>
      >()
      .mockImplementation((work) => work(runner as unknown as QueryRunner));
    const vehicles = new VehicleService(
      { manager: { findOne: findVehicle } } as unknown as VehicleRepository,
      {} as CustomerService,
    );
    const parking = new ParkingRecordService(
      { transaction } as unknown as ParkingRecordRepository,
      vehicles,
    );
    const readings = new PlateReadingService(
      {
        manager: {
          find: jest.fn<() => Promise<unknown>>().mockResolvedValue([reading]),
        },
        transaction,
      } as unknown as PlateReadingRepository,
      vehicles,
      parking,
    );

    await expect(readings.processor.execute()).resolves.toEqual({
      message: 'Dados atualizados com sucesso',
    });

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(findVehicle).not.toHaveBeenCalled();
    expect(runner.manager.findOne).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({ where: { licensePlate: expect.anything() } }),
    );
    expect(save).toHaveBeenCalledWith(
      ParkingRecordEntity,
      expect.objectContaining({
        entrySource: EParkingRecordSource.AI,
        entryReading: { id: 1 },
        entryTime: reading.createdAt,
      }),
    );
    expect(save).toHaveBeenLastCalledWith(PlateReadingEntity, [
      expect.objectContaining({ id: 1, processedAt: expect.any(Date) }),
    ]);
  });
});

describe('Nest dependency initialization', () => {
  it('initializes every provider before processing the first reading', async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const reading = {
      id: 1,
      licensePlate: 'ABC1D23',
      createdAt: new Date('2026-01-01T12:00:00Z'),
    };
    const vehicle = { id: 2, licensePlate: 'ABC1D23', isServiceVehicle: false };
    const save = jest
      .fn<(entity: unknown, data: unknown) => Promise<unknown>>()
      .mockImplementation(async (_entity, data) => data);
    const runner = {
      manager: {
        findOne: jest
          .fn<() => Promise<unknown>>()
          .mockResolvedValueOnce(vehicle)
          .mockResolvedValue(null),
        save,
      },
    };
    const transaction = jest
      .fn<
        (work: (query: QueryRunner) => Promise<unknown>) => Promise<unknown>
      >()
      .mockImplementation((work) => work(runner as unknown as QueryRunner));
    const module = await Test.createTestingModule({
      providers: [
        PlateReadingService,
        ParkingRecordService,
        VehicleService,
        { provide: CustomerService, useValue: {} },
        {
          provide: PlateReadingRepository,
          useValue: {
            manager: {
              find: jest
                .fn<() => Promise<unknown>>()
                .mockResolvedValue([reading]),
            },
            transaction,
          },
        },
        { provide: VehicleRepository, useValue: { manager: {} } },
        { provide: ParkingRecordRepository, useValue: { transaction } },
      ],
    }).compile();
    await module.init();
    try {
      const readings = module.get(PlateReadingService);
      await expect(readings.processor.execute()).resolves.toEqual({
        message: 'Dados atualizados com sucesso',
      });
      expect(save).toHaveBeenCalledWith(
        ParkingRecordEntity,
        expect.objectContaining({ entryReading: { id: 1 } }),
      );
    } finally {
      await module.close();
    }
  });
});
