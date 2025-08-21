import { PrometheusInterceptor } from '@core/metrics/domain/interceptors/prometheus-interceptor';
import { MetricsService } from '@core/metrics/services/metrics.service';
import { ReporterService } from '@core/metrics/services/reporter.service';
import { INestApplication } from '@nestjs/common';

export class MetricsConfig {
  /**
   * Inicialização do módulo de metricas da aplicação
   * @param app Instancia da aplicação
   */
  public static start(app: INestApplication): void {
    app.useGlobalInterceptors(
      new PrometheusInterceptor(new ReporterService(app.get(MetricsService))),
    );
  }
}
