import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PrometheusInitService } from '../services/prometheus-init.service';

@Controller('metrics')
@ApiTags('Métricas da aplicação - metrics')
export class MetricsController {
  public constructor(
    private readonly prometheusInitService: PrometheusInitService,
  ) {}

  @Get()
  public metrics() {
    return this.prometheusInitService.registry.metrics();
  }
}
