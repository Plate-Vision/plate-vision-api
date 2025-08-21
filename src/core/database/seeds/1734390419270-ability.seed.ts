import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { EAbilityReference } from '@modules/role/domain/enums/ability-reference.enum';

export class AbilitySeed1734390419270 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const abilityRepository = dataSource.getRepository(AbilityEntity);

    const abilitiesInDatabase = await abilityRepository.find();
    const abilities = await this.getAbilities();

    const hasAbilities = await abilityRepository.exists();

    if (hasAbilities && abilitiesInDatabase.length === abilities.length) {
      console.log('Seed de ability executada anteriormente.');
      return;
    }

    const abilitiesNotInDatabase = abilities.filter((ability) => {
      return !abilitiesInDatabase.find(
        (abilityInDatabase) =>
          abilityInDatabase.reference === ability.reference,
      );
    });

    await abilityRepository.save(abilitiesNotInDatabase);

    console.log('Seed de ability executada com sucesso!');
  }

  private async getAbilities(): Promise<Array<Partial<AbilityEntity>>> {
    return [
      {
        name: 'Usuários',
        reference: EAbilityReference.USER,
      },
      {
        name: 'Perfis de Usuário',
        reference: EAbilityReference.ROLE,
      },
      // warning: add new abilities here whatever of when they are created
    ];
  }
}
