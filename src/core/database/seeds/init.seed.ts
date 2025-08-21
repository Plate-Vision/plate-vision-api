import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import { AbilitySeed1734390419270 } from './1734390419270-ability.seed';
import { RoleSeed1734391606183 } from './1734391606183-role.seed';
import { UserSeed1734394989295 } from './1734394989295-user.seed';

export class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeders(dataSource, {
      seeds: [
        AbilitySeed1734390419270,
        RoleSeed1734391606183,
        UserSeed1734394989295,
      ],
    });

    console.log('Seeds executadas com sucesso!');
  }
}
