import { In } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { CreateRoleDTO } from '@modules/role/domain/dtos/create-role.dto';
import { RoleRepository } from '@modules/role/domain/repositories/role.repository';
import { RoleAbilityEntity } from '@modules/role/domain/entities/role-ability.entity';
import { EAbilityReference } from '@modules/role/domain/enums/ability-reference.enum';
import { AbilityRepository } from '@modules/role/domain/repositories/ability.repository';
import { CreateRoleAbilityDTO } from '@modules/role/domain/dtos/create-role-ability.dto';

export class CreateRoleProvider {
  public constructor(
    private readonly roleRepository: RoleRepository,
    private readonly abilityRepository: AbilityRepository,
  ) {}

  public async execute(data: CreateRoleDTO) {
    await this.validateRoleName(data.name);

    return this.roleRepository.transaction(async (queryRunner) => {
      const role = await queryRunner.manager.save(
        RoleEntity,
        this.serializeRole(data),
      );

      const roleAbilities = await this.serializeRoleAbilities(
        role.id,
        data.abilities,
      );

      const roleAbilitiesSaved = await queryRunner.manager.save(roleAbilities);

      role.roleAbilities = roleAbilitiesSaved;

      return role;
    });
  }

  private serializeRole(data: CreateRoleDTO) {
    return plainToInstance(RoleEntity, {
      ...data,
      abilities: undefined,
      roleAbilities: [],
    });
  }

  private async serializeRoleAbilities(
    roleId: number,
    abilities: Array<CreateRoleAbilityDTO>,
  ) {
    const foundAbilities = await this.findAbilities(
      abilities.map(({ reference }) => reference),
    );

    return foundAbilities.map(({ id: abilityId, reference }) => {
      const abilityInDto = abilities.find((dto) => dto.reference == reference);

      return plainToInstance(RoleAbilityEntity, {
        ...abilityInDto,
        ability: {
          id: abilityId,
        },
        role: {
          id: roleId,
        },
      });
    });
  }

  private async findAbilities(references: Array<EAbilityReference>) {
    return await this.abilityRepository.manager.find({
      select: {
        id: true,
        reference: true,
      },
      where: {
        reference: In(references),
      },
    });
  }

  private async validateRoleName(name: string) {
    const role = await this.roleRepository.manager.findOne({
      select: {
        id: true,
      },
      where: {
        name,
      },
    });

    if (role) {
      throw new HttpException(
        'Este perfil já foi cadastrado em nosso sistema',
        403,
      );
    }
  }
}
