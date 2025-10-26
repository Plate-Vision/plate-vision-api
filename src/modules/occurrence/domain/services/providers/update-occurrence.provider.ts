import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { OccurrenceService } from '../occurrence.service';
import { UpdateOccurrenceDTO } from '../../dtos/update-occurrence.dto';
import { OccurrenceEntity } from '../../entities/occurrence.entity';
import { EOccurrenceStatus } from '../../enums/occurrence-status.enum';

export class UpdateOccurrenceProvider {
  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
    private readonly occurrenceService: OccurrenceService,
  ) {}

  public async execute(data: {
    uuid: string;
    data: UpdateOccurrenceDTO;
    authUser?: UserEntity;
    file?: Express.Multer.File;
  }): Promise<OccurrenceEntity> {
    const occurrence = await this.occurrenceService.findOne.execute(data.uuid);

    if (occurrence.status === EOccurrenceStatus.INACTIVE) {
      throw new HttpException('Ocorrência inativa não pode ser editada', 400);
    }

    let newUrlImage: string | null = occurrence.urlImage ?? null;

    if (data.file) {
      if (occurrence.urlImage) {
        const publicId =
          this.occurrenceService.deleteImage.extractPublicIdFromUrl(
            occurrence.urlImage,
          );
        if (publicId) {
          await this.occurrenceService.deleteImage.execute(publicId);
        }
      }
      newUrlImage = await this.occurrenceService.createImage.execute(data.file);
    }

    return await this.occurrenceRepository.transaction(async (query) => {
      const updateOccurrence = await query.manager.save(
        await this.serializeCustomerData(
          occurrence,
          data.data,
          data.authUser,
          newUrlImage,
        ),
      );

      return updateOccurrence;
    });
  }
  private async serializeCustomerData(
    occurrence: OccurrenceEntity,
    data: UpdateOccurrenceDTO,
    user: UserEntity,
    newUrlImage?: string,
  ) {
    return plainToInstance(
      OccurrenceEntity,
      { ...occurrence, ...data, userUpdated: user, urlImage: newUrlImage },
      { ignoreDecorators: true },
    );
  }
}
