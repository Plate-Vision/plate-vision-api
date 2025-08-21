import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ERoleReference } from '@modules/role/domain/enums/role-reference.enum';

export const ROLES_KEY = 'roles';

export const Roles = (
  ...roles: Array<ERoleReference>
): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
