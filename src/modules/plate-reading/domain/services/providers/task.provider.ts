import { PlateReadingRepository } from '@modules/plate-reading/infra/repositories/plate-reading.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskProvider {
  private readonly logger = new Logger(TaskProvider.name);

  public constructor(
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  public async handleCron() {
    this.logger.debug('Executando job...');

    try {
      const vehicles = await this.plateReadingRepository.manager.find({
        where: { processedAt: null },
      });

      if (vehicles.length === 0) {
        this.logger.debug('Nenhum dado para atualizar.');
        return;
      }

      this.logger.log(vehicles);

      // TODO chamar funções de regras de negócio para entra e saída de veículos
    } catch (error) {
      this.logger.error('Falha ao executar o job', error.stack);
    }
  }
}
