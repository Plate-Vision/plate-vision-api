import { In } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { UpdateRoleDTO } from '@modules/role/domain/dtos/update-role.dto';
import { AbilityEntity } from '@modules/role/domain/entities/ability.entity';
import { RoleRepository } from '@modules/role/domain/repositories/role.repository';
import { EAbilityReference } from '@modules/role/domain/enums/ability-reference.enum';
import { RoleAbilityEntity } from '@modules/role/domain/entities/role-ability.entity';
import { AbilityRepository } from '@modules/role/domain/repositories/ability.repository';
import { UpdateRoleAbilitiesDTO } from '@modules/role/domain/dtos/update-role-ability.dto';

export class UpdateRoleProvider {
  public constructor(
    private readonly roleRepository: RoleRepository,
    private readonly abilityRepository: AbilityRepository,
  ) {}

  public async execute(id: number, data: UpdateRoleDTO): Promise<RoleEntity> {
    await this.validateRoleId(id);

    return await this.roleRepository.transaction(async (queryRunner) => {
      await queryRunner.manager.delete(RoleAbilityEntity, { role: { id } });

      const role = this.serializeRole(data);

      const roleAbilities = await this.serializeRoleAbilities(
        id,
        data.abilities,
      );

      const [_, roleAbilitiesSaved] = await Promise.all([
        queryRunner.manager.update(RoleEntity, id, role),
        queryRunner.manager.save(RoleAbilityEntity, roleAbilities),
      ]);

      role.roleAbilities = roleAbilitiesSaved;

      return role;
    });
  }

  private serializeRole(data: UpdateRoleDTO): RoleEntity {
    return plainToInstance(RoleEntity, {
      ...data,
      abilities: undefined,
    });
  }

  private async serializeRoleAbilities(
    roleId: number,
    abilities: Array<UpdateRoleAbilitiesDTO>,
  ): Promise<Array<RoleAbilityEntity>> {
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

  private async findAbilities(
    references: Array<EAbilityReference>,
  ): Promise<Array<AbilityEntity>> {
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

  private async validateRoleId(id: number): Promise<void> {
    const roleFound = await this.roleRepository.manager.findOne({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });

    if (!roleFound) throw new HttpException('Perfil não encontrado', 404);
  }
}
