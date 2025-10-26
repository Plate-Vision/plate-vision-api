import { PartialType } from '@nestjs/mapped-types';
import { CreateOccurrenceDTO } from './create-occurrence.dto';

export class UpdateOccurrenceDTO extends PartialType(CreateOccurrenceDTO) {}
