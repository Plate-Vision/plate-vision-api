import {
  DataSource,
  DataSourceOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { DatabaseConnection } from '../connection/database.connection';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

export abstract class BaseRepository<T extends BaseEntity> {
  public manager: Repository<T>;

  public constructor(
    repository: Repository<T>,
    private readonly env: EnvironmentVariablesProvider,
  ) {
    this.manager = repository;
  }

  public async transaction<T>(query: (queryRunner: QueryRunner) => Promise<T>) {
    const source = new DataSource(
      new DatabaseConnection(this.env).getConnection() as DataSourceOptions,
    );
    await source.initialize();
    const queryRunner = source.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await query(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      await source.destroy();
    }
  }
}
