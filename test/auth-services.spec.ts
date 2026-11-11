import 'reflect-metadata';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { LoginProvider } from '@modules/auth/domain/services/providers/login.provider';
import { TokenProvider } from '@modules/auth/domain/services/providers/token.provider';
import { TokenRefreshProvider } from '@modules/auth/domain/services/providers/token-refresh.provider';
import { PasswordResetProvider } from '@modules/auth/domain/services/providers/password-reset.provider';
import { PasswordRecoveryProvider } from '@modules/auth/domain/services/providers/password-recovery.provider';
import { PasswordHelper } from '@modules/user/domain/helpers/password.helper';
import { UserRepository } from '@modules/user/infra/repositories/user.repository';
import { EUserStatus } from '@modules/user/domain/enums/user-status.enum';
import { EnvironmentVariablesProvider } from '@core/enviroment-variables/providers/enviroment-variables.provider';

const payload = { id: 7, email: 'member@example.com' };
const tokens = { token: 'access-token', refreshToken: 'refresh-token' };
const createTokenStub = () => ({
  execute: jest.fn<() => Promise<unknown>>().mockResolvedValue(tokens),
  verify: jest.fn<() => Promise<unknown>>().mockResolvedValue(payload),
});
afterEach(() => jest.restoreAllMocks());

describe('LoginProvider', () => {
  const password = 'valid-password';
  const hash = PasswordHelper.hashSync(password);
  const createSubject = () => {
    const user = {
      ...payload,
      password: hash,
      status: EUserStatus.ACTIVE,
      resetPassword: true,
    };
    const findOne = jest.fn<() => Promise<unknown>>().mockResolvedValue(user);
    const token = createTokenStub();
    const provider = new LoginProvider(
      { manager: { findOne } } as unknown as UserRepository,
      token as unknown as TokenProvider,
    );
    return { provider, findOne, token, user };
  };

  it('authenticates a stored password and returns the reset flag', async () => {
    const { provider, findOne, token } = createSubject();
    expect(await provider.execute({ email: payload.email, password })).toEqual({
      ...tokens,
      resetPassword: true,
    });
    expect(findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: payload.email },
        select: expect.objectContaining({ password: true }),
      }),
    );
    expect(token.execute).toHaveBeenCalledWith(payload);
  });

  it('rejects missing users without issuing tokens', async () => {
    const { provider, findOne, token } = createSubject();
    findOne.mockResolvedValue(null);
    await expect(
      provider.execute({ email: payload.email, password }),
    ).rejects.toMatchObject({
      message: 'Email e/ou senha do usuário inválida(os)',
      status: 404,
    });
    expect(token.execute).not.toHaveBeenCalled();
  });

  it('rejects a wrong password', async () => {
    const { provider, token } = createSubject();
    await expect(
      provider.execute({ email: payload.email, password: 'wrong' }),
    ).rejects.toMatchObject({ status: 404 });
    expect(token.execute).not.toHaveBeenCalled();
  });

  it('rejects an inactive account after password verification', async () => {
    const { provider, findOne, user, token } = createSubject();
    findOne.mockResolvedValue({ ...user, status: EUserStatus.INACTIVE });
    await expect(
      provider.execute({ email: payload.email, password }),
    ).rejects.toMatchObject({ status: 403 });
    expect(token.execute).not.toHaveBeenCalled();
  });
});

describe('TokenProvider', () => {
  const secret = 'unit-test-signing-secret';
  const jwt = new JwtService({ secret });
  const provider = new TokenProvider(jwt, {
    application: { authToken: secret },
  } as EnvironmentVariablesProvider);

  it('signs and verifies actual JWTs with distinct access and refresh lifetimes', async () => {
    const result = await provider.execute(payload);
    const access = await provider.verify(result.token);
    const refresh = await provider.verify(result.refreshToken);
    expect(access).toEqual(expect.objectContaining(payload));
    expect(refresh).toEqual(expect.objectContaining(payload));
    const accessClaims = jwt.decode<{ iat: number; exp: number }>(result.token);
    const refreshClaims = jwt.decode<{ iat: number; exp: number }>(
      result.refreshToken,
    );
    expect(accessClaims.exp - accessClaims.iat).toBe(2 * 60 * 60);
    expect(refreshClaims.exp - refreshClaims.iat).toBe(7 * 24 * 60 * 60);
  });

  it('returns the existing forbidden-token error for invalid JWTs', async () => {
    await expect(provider.verify('invalid')).rejects.toMatchObject({
      status: 403,
      message: 'Token inválido',
    });
  });
});

describe('TokenRefreshProvider', () => {
  const createSubject = () => {
    const findOne = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue({ status: EUserStatus.ACTIVE });
    const token = createTokenStub();
    const provider = new TokenRefreshProvider(
      { manager: { findOne } } as unknown as UserRepository,
      token as unknown as TokenProvider,
    );
    return { findOne, token, provider };
  };

  it('issues new tokens only after validating the stored account status', async () => {
    const { provider, findOne, token } = createSubject();
    expect(await provider.execute({ refresh: 'refresh-token' })).toBe(tokens);
    expect(token.verify).toHaveBeenCalledWith('refresh-token');
    expect(findOne).toHaveBeenCalledWith({
      select: { status: true },
      where: { email: payload.email },
    });
    expect(token.execute).toHaveBeenCalledWith(payload);
  });

  it.each([
    [null, 404],
    [{ status: EUserStatus.INACTIVE }, 403],
  ])('rejects stored account %p with HTTP%i', async (user, status) => {
    const { provider, findOne, token } = createSubject();
    findOne.mockResolvedValue(user);
    await expect(
      provider.execute({ refresh: 'refresh-token' }),
    ).rejects.toMatchObject({ status });
    expect(token.execute).not.toHaveBeenCalled();
  });

  it('preserves token verification failure without querying accounts', async () => {
    const { provider, token, findOne } = createSubject();
    const failure = new Error('invalid refresh');
    token.verify.mockRejectedValue(failure);
    await expect(provider.execute({ refresh: 'bad' })).rejects.toBe(failure);
    expect(findOne).not.toHaveBeenCalled();
  });
});

describe('PasswordResetProvider', () => {
  it('hashes the new password and clears the reset flag for the verified user', async () => {
    const findOne = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue({ ...payload, password: 'old', resetPassword: true });
    const update = jest
      .fn<() => Promise<unknown>>()
      .mockResolvedValue(undefined);
    const token = createTokenStub();
    jest.spyOn(PasswordHelper, 'hash').mockResolvedValue('new-hash');
    const provider = new PasswordResetProvider(
      { manager: { findOne, update } } as unknown as UserRepository,
      token as unknown as TokenProvider,
    );
    expect(
      await provider.execute({
        token: 'reset-token',
        password: 'new-password',
      }),
    ).toEqual({ message: 'Senha redefinida com sucesso' });
    expect(token.verify).toHaveBeenCalledWith('reset-token');
    expect(findOne).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(update).toHaveBeenCalledWith(7, {
      ...payload,
      password: 'new-hash',
      resetPassword: false,
    });
  });

  it('rejects missing users before hashing', async () => {
    const findOne = jest.fn<() => Promise<unknown>>().mockResolvedValue(null);
    const hash = jest.spyOn(PasswordHelper, 'hash');
    const provider = new PasswordResetProvider(
      { manager: { findOne } } as unknown as UserRepository,
      createTokenStub() as unknown as TokenProvider,
    );
    await expect(
      provider.execute({ token: 'reset-token', password: 'new-password' }),
    ).rejects.toMatchObject({ status: 404, message: 'Usuário não encontrado' });
    expect(hash).not.toHaveBeenCalled();
  });
});

describe('PasswordRecoveryProvider', () => {
  it('preserves the unimplemented mail error after creating a recovery token', async () => {
    const token = createTokenStub();
    const provider = new PasswordRecoveryProvider(
      {
        manager: {
          findOne: jest.fn<() => Promise<unknown>>().mockResolvedValue(payload),
        },
      } as unknown as UserRepository,
      token as unknown as TokenProvider,
    );
    await expect(provider.execute(payload.email)).rejects.toMatchObject({
      status: 501,
      message: 'Email não implementado',
    });
    expect(token.execute).toHaveBeenCalledWith(payload);
  });

  it('rejects an unknown email before token creation', async () => {
    const token = createTokenStub();
    const provider = new PasswordRecoveryProvider(
      {
        manager: {
          findOne: jest.fn<() => Promise<unknown>>().mockResolvedValue(null),
        },
      } as unknown as UserRepository,
      token as unknown as TokenProvider,
    );
    await expect(provider.execute(payload.email)).rejects.toMatchObject({
      status: 404,
    });
    expect(token.execute).not.toHaveBeenCalled();
  });
});

describe('PasswordHelper', () => {
  it('hashes asynchronously and checks both matching and wrong passwords', async () => {
    const hash = await PasswordHelper.hash('example-password');
    expect(hash).not.toBe('example-password');
    expect(await PasswordHelper.compare('example-password', hash)).toBe(true);
    expect(await PasswordHelper.compare('wrong-password', hash)).toBe(false);
    expect(PasswordHelper.compareSync('example-password', hash)).toBe(true);
    expect(PasswordHelper.compareSync('wrong-password', hash)).toBe(false);
  });

  it('rejects missing passwords for hashing', async () => {
    await expect(PasswordHelper.hash('')).rejects.toThrow('Senha requerida');
    expect(() => PasswordHelper.hashSync('')).toThrow('Senha requerida');
  });

  it.each([
    ['', 'hash'],
    ['password', ''],
  ])(
    'returns false for incomplete credentials %p/%p',
    async (password, hash) => {
      expect(await PasswordHelper.compare(password, hash)).toBe(false);
      expect(PasswordHelper.compareSync(password, hash)).toBe(false);
    },
  );
});
