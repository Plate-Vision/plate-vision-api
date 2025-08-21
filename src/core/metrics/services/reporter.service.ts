import { Injectable } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Injectable()
export class ReporterService {
  public constructor(private readonly metricService: MetricsService) {}
  public async execute(
    route: string,
    method: string,
    memoryUsage: number,
    cpuUsage: number,
  ) {
    this.metricService.incCounter('request', {
      route,
      method,
    });
    this.metricService.setGauge('memory_usage', memoryUsage, {
      route,
      method,
    });
    this.metricService.setGauge('cpu_usage', cpuUsage == 0 ? 1 : cpuUsage, {
      route,
      method,
    });
  }
}
