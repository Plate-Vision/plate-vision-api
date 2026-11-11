import 'reflect-metadata';
import { describe, expect, it, jest } from '@jest/globals';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@modules/auth/domain/guards/auth.guard';
import { AbilityGuard } from '@modules/auth/domain/guards/ability.guard';
import { RoleGuard } from '@modules/auth/domain/guards/role.guard';
import { UserRepository } from '@modules/user/infra/repositories/user.repository';
import { AuthService } from '@modules/auth/domain/services/auth.service';

const createContext = (request: unknown) =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => () => undefined,
    getClass: () => class Controller {},
  }) as unknown as ExecutionContext;

const createReflector = (values: Record<string, string[]>) =>
  ({
    getAllAndOverride: jest
      .fn<(key: string) => string[]>()
      .mockImplementation((key) => values[key]),
  }) as unknown as Reflector;

describe('AuthGuard', () => {
  const createSubject = () => {
    const verify = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue({ id: 7 });
    const findOne = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue({ id: 7, name: 'Arthur' });
    const guard = new AuthGuard(
      { manager: { findOne } } as unknown as UserRepository,
      { token: { verify } } as unknown as AuthService,
    );
    return { verify, findOne, guard };
  };

  it.each([undefined, 'Basic credentials', 'Bearer'])(
    'rejects missing or malformed authorization %p',
    async (authorization) => {
      const { guard, verify } = createSubject();
      await expect(
        guard.canActivate(createContext({ headers: { authorization } })),
      ).rejects.toMatchObject({ status: 401 });
      expect(verify).not.toHaveBeenCalled();
    },
  );

  it('verifies the bearer token and attaches the stored user', async () => {
    const { guard, verify, findOne } = createSubject();
    const request = {
      headers: { authorization: 'Bearer valid-token' },
      user: undefined,
    };
    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(verify).toHaveBeenCalledWith('valid-token');
    expect(findOne).toHaveBeenCalledWith({
      where: { id: 7 },
      relations: ['role', 'role.roleAbilities', 'role.roleAbilities.ability'],
    });
    expect(request.user).toEqual({ id: 7, name: 'Arthur' });
  });

  it('normalizes token failures to HTTP401 without a user query', async () => {
    const { guard, verify, findOne } = createSubject();
    verify.mockRejectedValue(new Error('invalid signature'));
    await expect(
      guard.canActivate(
        createContext({ headers: { authorization: 'Bearer bad' } }),
      ),
    ).rejects.toMatchObject({ status: 401 });
    expect(findOne).not.toHaveBeenCalled();
  });

  it('normalizes an unknown token user to HTTP401', async () => {
    const { guard, findOne } = createSubject();
    findOne.mockResolvedValue(null);
    await expect(
      guard.canActivate(
        createContext({ headers: { authorization: 'Bearer valid' } }),
      ),
    ).rejects.toMatchObject({ status: 401 });
  });
});

describe('RoleGuard', () => {
  it.each([undefined, []])(
    'permits routes with role requirements %p',
    (roles) => {
      const guard = new RoleGuard(createReflector({ roles }));
      expect(guard.canActivate(createContext({}))).toBe(true);
    },
  );

  it('permits a matching role', () => {
    const guard = new RoleGuard(createReflector({ roles: ['MASTER'] }));
    expect(
      guard.canActivate(
        createContext({ user: { role: { reference: 'MASTER' } } }),
      ),
    ).toBe(true);
  });

  it('rejects a role outside the allowed set', () => {
    const guard = new RoleGuard(createReflector({ roles: ['MASTER'] }));
    expect(() =>
      guard.canActivate(
        createContext({ user: { role: { reference: 'USER' } } }),
      ),
    ).toThrow('Usuário não possui o perfil necessário para acessar esta rota');
  });
});

describe('AbilityGuard', () => {
  const ability = {
    ability: { reference: 'PARKINGS' },
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
  };
  const user = { role: { roleAbilities: [ability] } };

  it.each([undefined, {}, { role: {} }])(
    'rejects users without role abilities %p',
    (invalidUser) => {
      const guard = new AbilityGuard(createReflector({}));
      expect(() =>
        guard.canActivate(createContext({ user: invalidUser })),
      ).toThrow(
        'Usuário não possui perfil ou habilidade para acessar esta rota',
      );
    },
  );

  it('permits routes without required abilities after the profile check', () => {
    const guard = new AbilityGuard(createReflector({}));
    expect(guard.canActivate(createContext({ user }))).toBe(true);
  });

  it('rejects missing required abilities', () => {
    const guard = new AbilityGuard(createReflector({ abilities: ['OTHER'] }));
    expect(() => guard.canActivate(createContext({ user }))).toThrow(
      'Usuário não possui habilidade para acessar esta rota',
    );
  });

  it('permits matching abilities without action restrictions', () => {
    const guard = new AbilityGuard(
      createReflector({ abilities: ['PARKINGS'] }),
    );
    expect(guard.canActivate(createContext({ user }))).toBe(true);
  });

  it.each(['CREATE', 'READ', 'UPDATE', 'DELETE'])(
    'permits the authorized action %s',
    (action) => {
      const guard = new AbilityGuard(
        createReflector({ abilities: ['PARKINGS'], actions: [action] }),
      );
      expect(guard.canActivate(createContext({ user }))).toBe(true);
    },
  );

  it.each(['UNKNOWN', 'DELETE'])(
    'rejects unsupported or denied action %s',
    (action) => {
      const guard = new AbilityGuard(
        createReflector({ abilities: ['PARKINGS'], actions: [action] }),
      );
      const restrictedUser = {
        role: { roleAbilities: [{ ...ability, canDelete: false }] },
      };
      expect(() =>
        guard.canActivate(createContext({ user: restrictedUser })),
      ).toThrow('Usuário não possui permissão para acessar esta rota');
    },
  );
});
