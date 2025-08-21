import { SelectQueryBuilder } from 'typeorm';

import { BaseEntity } from '@core/database/domain/entities/base.entity';
import { BaseRepository } from '@core/database/domain/repositories/base.repository';

import { FindManyDTO } from '@shared/dtos/find-many.dto';
import { FindManyPayload } from '@shared/payloads/find-many.payload';

export abstract class FindManyProvider<
  T extends BaseEntity,
  V extends FindManyDTO,
> {
  public constructor(
    private readonly repositoryBase: BaseRepository<T>,
    protected readonly alias: string,
  ) {}

  protected async apply({
    dto: data,
    authUser,
  }: {
    dto: V;
    authUser: unknown;
  }): Promise<FindManyPayload<T>> {
    const { take, skip } = this.createFiltersPagination(data);

    const originalQuery = this.repositoryBase.manager.createQueryBuilder(
      this.alias,
    );

    if (take) {
      originalQuery.take(take);
    }

    if (skip) {
      originalQuery.skip(skip);
    }

    const query = await this.createQuery(data, authUser, originalQuery);

    const [result, total] = await query.getManyAndCount();

    const pages = total && take ? Math.round(total / take) : 0;

    const payload = new FindManyPayload<T>();

    payload.data = await this.formatData(result, authUser);
    payload.pages = pages ? pages : 1;
    payload.total = total;

    return payload;
  }

  protected async formatData(data: T[], _user: unknown) {
    return data;
  }

  protected abstract createQuery(
    dto: V,
    authUser: unknown,
    query: SelectQueryBuilder<T>,
  ): Promise<SelectQueryBuilder<T>>;

  protected async termFilter(
    query: SelectQueryBuilder<T>,
    term: string,
    fields: string[],
  ) {
    const fieldsTerm = await Promise.all(
      fields.map((field) => {
        if (field.includes('.') || field.includes(')')) {
          return `(${field} ILIKE '%${term}%')`;
        }
        return `(${this.alias}.${field} ILIKE '%${term}%')`;
      }),
    );
    const queryTerm = fieldsTerm.join('OR');
    query.andWhere(`(${queryTerm})`);
  }

  protected inFilter<J>(
    query: SelectQueryBuilder<T>,
    field: string,
    values: J[],
  ) {
    const valuesArray = Array.isArray(values) ? values : [values];
    if (!valuesArray.length) {
      return query;
    }
    const isString =
      typeof valuesArray[0] == 'string' || typeof valuesArray[0] == 'object';
    const inValue = isString
      ? `('${valuesArray.join("','")}')`
      : `(${valuesArray.join(',')})`;

    const inField = field.includes('.') ? field : `${this.alias}.${field}`;

    query.andWhere(`${inField} IN ${inValue}`);
  }

  private createFiltersPagination(dto: V) {
    return {
      take: dto.take,
      skip: dto.take ? +dto.take * ((+dto.skip || 1) - 1) : undefined,
    };
  }
}
