import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { ERoleReference } from '@modules/role/domain/enums/role-reference.enum';
import { RoleAbilityEntity } from '@modules/role/domain/entities/role-ability.entity';

export class RoleSeed1734391606183 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(RoleEntity);
    const abilityRepository = dataSource.getRepository(AbilityEntity);
    const roleAbilityRepository = dataSource.getRepository(RoleAbilityEntity);

    const abilities = await abilityRepository.find();

    const masterAbilities = await abilityRepository.find({
      where: {
        roleAbilities: {
          role: {
            reference: ERoleReference.MASTER,
          },
        },
      },
      relations: ['roleAbilities', 'roleAbilities.role'],
    });

    const hasRoles = await roleRepository.exists();

    if (hasRoles && masterAbilities.length === abilities.length) {
      console.log('Seed de role executada anteriormente.');
      return;
    }

    if (masterAbilities.length && masterAbilities.length !== abilities.length) {
      const abilitiesToInsertInRoles = abilities.filter((ability) => {
        return !masterAbilities.find(
          (roleAbility) => roleAbility.id === ability.id,
        );
      });

      const adminRole = await roleRepository.findOne({
        where: { reference: ERoleReference.ADMIN },
      });

      const rolesToInsert = [
        masterAbilities[0].roleAbilities[0].role,
        adminRole,
      ];

      rolesToInsert.flatMap((role) => {
        return abilitiesToInsertInRoles.map((ability) => {
          return roleAbilityRepository.save({
            role,
            ability,
          });
        });
      });

      console.log('Seed de role executada parcialmente.');

      return;
    }

    const partialRoles = await this.getRoles();

    const roles = await roleRepository.save(partialRoles);

    const roleAbilities = roles.flatMap((role) => {
      return abilities.map((ability) => {
        return roleAbilityRepository.create({
          role,
          ability,
        });
      });
    });

    await roleAbilityRepository.save(roleAbilities);

    console.log('Seed de role executada com sucesso!');
  }

  private async getRoles(): Promise<Array<Partial<RoleEntity>>> {
    return [
      {
        name: 'Master',
        reference: ERoleReference.MASTER,
      },
      {
        name: 'Administrador',
        reference: ERoleReference.ADMIN,
      },
      {
        name: 'Usuário',
        reference: ERoleReference.USER,
      },
      // warning: add new roles here whatever of when they are created
    ];
  }
}
