import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { ILike } from 'typeorm';
import { FindManyVehicleProvider } from '@modules/vehicle/domain/services/providers/find-many.vehicle.provider';
import { VehicleRepository } from '@modules/vehicle/infra/repositories/vehicle.repository';
import { EVehicleStatus } from '@modules/vehicle/domain/enums/vehicle-status.enum';

const createSubject = () => {
  const findAndCount = jest
    .fn<() => Promise<[unknown[], number]>>()
    .mockResolvedValue([[{ id: 1 }], 15]);
  const provider = new FindManyVehicleProvider({
    manager: { findAndCount },
  } as unknown as VehicleRepository);
  return { findAndCount, provider };
};

describe('Vehicle list', () => {
  it('uses default ordering and includes customer relations', async () => {
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
      relations: ['customer'],
    });
  });

  it('preserves search OR clauses, status, service flag and explicit pagination', async () => {
    const { provider, findAndCount } = createSubject();
    expect(
      (
        await provider.execute({
          dto: {
            search: 'ABC',
            status: EVehicleStatus.ACTIVE,
            isServiceVehicle: true,
            orderBy: 'licensePlate',
            ordering: 'DESC',
            take: 10,
            skip: 2,
          },
        })
      ).pages,
    ).toBe(2);
    expect(findAndCount).toHaveBeenCalledWith({
      where: [
        {
          status: EVehicleStatus.ACTIVE,
          modelName: ILike('%ABC%'),
          isServiceVehicle: true,
        },
        { status: EVehicleStatus.ACTIVE, licensePlate: ILike('%ABC%') },
      ],
      order: { licensePlate: 'DESC' },
      take: 10,
      skip: 2,
      relations: ['customer'],
    });
  });

  it('defaults a custom sort to ascending and returns the empty-list message', async () => {
    const { provider, findAndCount } = createSubject();
    findAndCount.mockResolvedValue([[], 0]);
    expect(
      await provider.execute({
        dto: { orderBy: 'licensePlate', isServiceVehicle: false },
      }),
    ).toEqual({
      data: [],
      total: 0,
      pages: 0,
      message: 'Nenhum veículo encontrado pelo filtro selecionado',
    });
    expect(findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ where: [{}], order: { licensePlate: 'ASC' } }),
    );
  });
});
