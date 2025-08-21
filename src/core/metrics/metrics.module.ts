import { Global, Module } from '@nestjs/common';

import { PrometheusInterceptor } from './domain/interceptors/prometheus-interceptor';
import { PrometheusInitService } from './services/prometheus-init.service';
import { MetricsController } from './controller/metrics-controller';
import { ReporterService } from './services/reporter.service';
import { MetricsService } from './services/metrics.service';

@Global()
@Module({
  providers: [
    PrometheusInitService,
    MetricsService,
    PrometheusInterceptor,
    ReporterService,
  ],
  controllers: [MetricsController],
  exports: [PrometheusInterceptor, MetricsService],
})
export class MetricsModule {}
