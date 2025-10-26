import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { MessagePayload } from '@shared/payloads/message.payload';
import { OccurrenceService } from '../occurrence.service';
import { OccurrenceEntity } from '../../entities/occurrence.entity';

export class DeleteOccurrenceProvider {
  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
    private readonly occurrenceService: OccurrenceService,
  ) {}

  public async execute(data: { uuid: string }): Promise<MessagePayload> {
    const occurrence = await this.occurrenceService.findOne.execute(data.uuid);

    await this.occurrenceRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.softDelete(OccurrenceEntity, {
        uuid: occurrence.uuid,
      });
    });

    if (occurrence.urlImage) {
      const publicId =
        this.occurrenceService.deleteImage.extractPublicIdFromUrl(
          occurrence.urlImage,
        );

      if (publicId) {
        await this.occurrenceService.deleteImage.execute(publicId);
      }
    }

    return { message: 'Ocorrência deletada com sucesso' };
  }
}
