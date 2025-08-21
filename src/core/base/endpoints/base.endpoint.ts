import { HttpService } from '@nestjs/axios';

export abstract class BaseEndpoint<T, V> {
  public constructor(
    protected readonly uri: string,
    protected readonly httpService: HttpService,
  ) {}

  public abstract call(data: T): Promise<V>;
}
