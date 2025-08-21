import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as pidusage from 'pidusage';

import { ReporterService } from '@core/metrics/services/reporter.service';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  public constructor(private readonly reporterService: ReporterService) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as Request;

    if (request.path == '/metrics') {
      return next.handle();
    }

    const startStats = await pidusage(process.pid);

    return next.handle().pipe((source) => {
      new Promise(async () => {
        const endStats = await pidusage(process.pid);

        const memoryDiff = endStats.memory - startStats.memory;

        const cpuDif = endStats.cpu;

        this.reporterService.execute(
          request.path,
          request.method,
          parseFloat((memoryDiff / 1024 / 1024).toFixed(2)),
          cpuDif,
        );
      });

      return source;
    });
  }
}
