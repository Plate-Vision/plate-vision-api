import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { Between } from 'typeorm';
import { FindManyParkingRecordProvider } from '@modules/parking-record/domain/services/providers/find-many-parking-record.provider';
import { ParkingRecordRepository } from '@modules/parking-record/infra/repositories/parking-record.repository';
import { FindManyParkingRecordDTO } from '@modules/parking-record/domain/dtos/find-many-parking-record.dto';
import { EParkingRecordSource } from '@modules/parking-record/domain/enums/parking-record-source.enum';

const createSubject = (data: unknown[] = [{ id: 1 }], total = 15) => {
  const findAndCount = jest
    .fn<() => Promise<[unknown[], number]>>()
    .mockResolvedValue([data, total]);
  const provider = new FindManyParkingRecordProvider({
    manager: { findAndCount },
  } as unknown as ParkingRecordRepository);
  return { provider, findAndCount };
};

describe('Parking list filters', () => {
  it('loads customer relations with default ordering and no filters', async () => {
    const { provider, findAndCount } = createSubject();
    expect(await provider.execute({ dto: {} })).toEqual({
      data: [{ id: 1 }],
      total: 15,
      pages: 1,
    });
    expect(findAndCount).toHaveBeenCalledWith({
      where: [{}],
      order: { id: 'DESC' },
      take: undefined,
      skip: undefined,
      relations: ['vehicle', 'vehicle.customer'],
    });
  });

  it('applies vehicle, sources, UTC date ranges, ordering and pagination', async () => {
    const { provider, findAndCount } = createSubject();
    const dto: FindManyParkingRecordDTO = {
      vehicleId: 4,
      entrySource: EParkingRecordSource.AI,
      exitSource: EParkingRecordSource.MA,
      entryTime: new Date('2026-01-01T12:00:00Z'),
      exitTime: new Date('2026-01-02T13:00:00Z'),
      orderBy: 'entryTime',
      ordering: 'ASC',
      take: 10,
      skip: 5,
    };
    expect((await provider.execute({ dto })).pages).toBe(2);
    expect(findAndCount).toHaveBeenCalledWith({
      where: [
        {
          vehicle: { id: 4 },
          entrySource: EParkingRecordSource.AI,
          exitSource: EParkingRecordSource.MA,
          entryTime: Between(
            new Date('2026-01-01T00:00:00.000Z'),
            new Date('2026-01-01T23:59:59.999Z'),
          ),
          exitTime: Between(
            new Date('2026-01-02T00:00:00.000Z'),
            new Date('2026-01-02T23:59:59.999Z'),
          ),
        },
      ],
      order: { entryTime: 'ASC' },
      take: 10,
      skip: 5,
      relations: ['vehicle', 'vehicle.customer'],
    });
  });

  it('defaults a requested sort field to ascending order', async () => {
    const { provider, findAndCount } = createSubject();
    await provider.execute({ dto: { orderBy: 'exitTime' } });
    expect(findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ order: { exitTime: 'ASC' } }),
    );
  });

  it('returns the existing empty-list message with zero pages', async () => {
    const { provider } = createSubject([], 0);
    expect(await provider.execute({ dto: { take: 10 } })).toEqual({
      data: [],
      total: 0,
      pages: 0,
      message: 'Nenhum registro encontrado pelo filtro selecionado',
    });
  });

  it('propagates storage failures', async () => {
    const { provider, findAndCount } = createSubject();
    const failure = new Error('database unavailable');
    findAndCount.mockRejectedValue(failure);
    await expect(provider.execute({ dto: {} })).rejects.toBe(failure);
  });
});
