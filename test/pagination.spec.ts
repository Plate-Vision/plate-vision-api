import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { SelectQueryBuilder } from 'typeorm';
import { FindManyProvider } from '@core/base/providers/find-many.provider';
import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';
import { FindManyDTO } from '@shared/dtos/find-many.dto';

class PaginationSubject extends FindManyProvider<BaseEntity, FindManyDTO> {
  execute(dto: FindManyDTO) {
    return this.apply({ dto, authUser: undefined });
  }

  protected async createQuery(
    _dto: FindManyDTO,
    _user: unknown,
    query: SelectQueryBuilder<BaseEntity>,
  ) {
    return query;
  }

  applyTerm(
    query: SelectQueryBuilder<BaseEntity>,
    term: string,
    fields: string[],
  ) {
    return this.termFilter(query, term, fields);
  }

  applyValues(
    query: SelectQueryBuilder<BaseEntity>,
    field: string,
    values: unknown[],
  ) {
    return this.inFilter(query, field, values);
  }
}

const createSubject = (total = 15) => {
  const result = [{ id: 1 }] as BaseEntity[];
  const query = {
    take: jest.fn(),
    skip: jest.fn(),
    andWhere: jest.fn(),
    getManyAndCount: jest
      .fn<() => Promise<[BaseEntity[], number]>>()
      .mockResolvedValue([result, total]),
  };
  const createQueryBuilder = jest.fn().mockReturnValue(query);
  const provider = new PaginationSubject(
    {
      manager: { createQueryBuilder },
    } as unknown as BaseRepository<BaseEntity>,
    'records',
  );
  return { result, query, createQueryBuilder, provider };
};

describe('Shared pagination provider', () => {
  it('uses one-based pages and returns the existing rounded page count', async () => {
    const { provider, query, result, createQueryBuilder } = createSubject();
    expect(await provider.execute({ take: 10, skip: 2 })).toEqual({
      data: result,
      total: 15,
      pages: 2,
    });
    expect(createQueryBuilder).toHaveBeenCalledWith('records');
    expect(query.take).toHaveBeenCalledWith(10);
    expect(query.skip).toHaveBeenCalledWith(10);
  });

  it('preserves Math.round rather than rounding incomplete pages upward', async () => {
    const { provider } = createSubject(11);
    expect((await provider.execute({ take: 10 })).pages).toBe(1);
  });

  it('omits pagination calls when take is absent', async () => {
    const { provider, query } = createSubject();
    expect((await provider.execute({})).pages).toBe(1);
    expect(query.take).not.toHaveBeenCalled();
    expect(query.skip).not.toHaveBeenCalled();
  });

  it('returns one page for an empty result', async () => {
    const { provider, query } = createSubject(0);
    query.getManyAndCount.mockResolvedValue([[], 0]);
    expect(await provider.execute({ take: 10 })).toEqual({
      data: [],
      pages: 1,
      total: 0,
    });
  });

  it('builds term filters for local, joined and expression fields', async () => {
    const { provider, query } = createSubject();
    await provider.applyTerm(
      query as unknown as SelectQueryBuilder<BaseEntity>,
      'sample',
      ['name', 'customer.name', 'LOWER(code)'],
    );
    expect(query.andWhere).toHaveBeenCalledWith(
      "((records.name ILIKE '%sample%')OR(customer.name ILIKE '%sample%')OR(LOWER(code) ILIKE '%sample%'))",
    );
  });

  it.each([
    ['id', [1, 2], 'records.id IN (1,2)'],
    ['customer.name', ['one', 'two'], "customer.name IN ('one','two')"],
  ])('builds a value filter for %s', (field, values, expected) => {
    const { provider, query } = createSubject();
    provider.applyValues(
      query as unknown as SelectQueryBuilder<BaseEntity>,
      field,
      values,
    );
    expect(query.andWhere).toHaveBeenCalledWith(expected);
  });

  it('normalizes scalar filters and skips an empty list', () => {
    const { provider, query } = createSubject();
    provider.applyValues(
      query as unknown as SelectQueryBuilder<BaseEntity>,
      'id',
      7 as unknown as unknown[],
    );
    expect(query.andWhere).toHaveBeenCalledWith('records.id IN (7)');
    query.andWhere.mockClear();
    expect(
      provider.applyValues(
        query as unknown as SelectQueryBuilder<BaseEntity>,
        'id',
        [],
      ),
    ).toBe(query);
    expect(query.andWhere).not.toHaveBeenCalled();
  });
});
