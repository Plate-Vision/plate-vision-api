import { OccurrenceRepository } from '@modules/occurrence/infra/repositories/occurrence.repository';
import { HttpException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { OccurrenceEntity } from '../../entities/occurrence.entity';

export class FindOneOccurrenceProvider {
  public constructor(
    private readonly occurrenceRepository: OccurrenceRepository,
  ) {}

  public async execute(uuid: string): Promise<OccurrenceEntity> {
    if (!isUUID(uuid)) {
      throw new HttpException('Ocorrência não encontrada', 404);
    }

    const occurrence = await this.occurrenceRepository.manager.findOne({
      where: {
        uuid: uuid,
      },
      relations: ['userCreated', 'userUpdated'],
    });

    if (occurrence) return occurrence;

    throw new HttpException('Ocorrência não encontrada', 404);
  }
}
