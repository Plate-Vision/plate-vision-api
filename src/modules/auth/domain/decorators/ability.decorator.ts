import { EAbilityReference } from '@modules/role/domain/enums/ability-reference.enum';
import { SetMetadata } from '@nestjs/common';

export const ABILITIES_KEY = 'abilities';

export const Abilities = (...abilities: Array<EAbilityReference>) =>
  SetMetadata(ABILITIES_KEY, abilities);
