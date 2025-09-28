import { Endpoint } from '@core/base/decorators/endpoint.decorator';
import { PlateReadingController } from '../../decorators/plate-reading.decorator';
import { PlateReadingService } from '@modules/plate-reading/domain/services/plate-reading.service';
import { PlateReadingEntity } from '@modules/plate-reading/domain/entities/plate-reading.entity';

@PlateReadingController.default()
export class DefaultPlateReadingController {
  public constructor(private readonly service: PlateReadingService) {}
  @Endpoint.get({
    url: '/',
    description:
      'Executa função de listar todas as leituras de placas não processadas para executar suas regras de negócio',
    roles: [],
    actions: [],
    abilities: [],
    responses: [
      {
        description: 'Regras das leituras de placas da IA',
        status: 200,
        findManyModel: PlateReadingEntity,
      },
    ],
  })
  public async processor() {
    return await this.service.processor.execute();
  }
}
