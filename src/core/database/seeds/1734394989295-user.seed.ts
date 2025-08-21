import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { PasswordHelper } from '@modules/user/domain/helpers/password.helper';
import { ERoleReference } from '@modules/role/domain/enums/role-reference.enum';

export class UserSeed1734394989295 implements Seeder {
  track = false;

  private masterUserEmail = 'master@email.com';

  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UserEntity);

    const hasUserMaster = await userRepository.exists({
      where: { email: this.masterUserEmail },
    });

    if (hasUserMaster) {
      console.log('Seed de user executada anteriormente.');
      return;
    }

    const roleRepository = dataSource.getRepository(RoleEntity);

    const role = await roleRepository.findOne({
      where: { reference: ERoleReference.MASTER },
    });

    const password = await PasswordHelper.hash('master1234');

    await userRepository.save({
      name: 'Master',
      email: this.masterUserEmail,
      password,
      role,
    });

    console.log('Seed de user executada com sucesso!');
  }
}
