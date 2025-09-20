import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindManyPlateReadingProvider } from './find-many.plate-reading.provider';

@Injectable()
export class TaskProvider {
  private readonly logger = new Logger(TaskProvider.name);

  public constructor(
    private readonly findManyPlateReadingProvider: FindManyPlateReadingProvider,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async handleCron() {
    this.logger.debug('Disparando job via CRON...');
    try {
      const result = await this.findManyPlateReadingProvider.execute();
      this.logger.log(`Job finalizado via CRON. ${result.message}`);
    } catch (error) {
      this.logger.error('Falha ao executar o job via CRON', error.stack);
    }
  }
}
