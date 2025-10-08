import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlateReadingService } from '../plate-reading.service';

@Injectable()
export class TaskProvider {
  private readonly logger = new Logger(TaskProvider.name);
  private isJobRunning = false;

  public constructor(
    private readonly plateReadingService: PlateReadingService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async handleCron() {
    if (this.isJobRunning) {
      return;
    }

    this.isJobRunning = true;
    this.logger.debug('Disparando job via CRON...');
    try {
      const result = await this.plateReadingService.processor.execute();
      this.logger.log(`${result.message}`);
    } catch (error) {
      this.logger.error('Falha ao executar o job via CRON', error.stack);
    } finally {
      this.isJobRunning = false;
    }
  }
}
