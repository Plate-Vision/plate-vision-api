import * as bcrypt from 'bcryptjs';

export class PasswordHelper {
  public static async hash(password: string): Promise<string> {
    const saltRounds = 10;

    if (!password) {
      throw new Error('Senha requerida');
    }

    return await bcrypt.hash(password, saltRounds);
  }

  public static hashSync(password: string): string {
    const saltRounds = 10;

    if (!password) {
      throw new Error('Senha requerida');
    }

    return bcrypt.hashSync(password, saltRounds);
  }

  public static async compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    if (!password || !hash) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, hash);

    return isMatch;
  }

  public static compareSync(password: string, hash: string): boolean {
    if (!password || !hash) {
      return false;
    }

    const isMatch = bcrypt.compareSync(password, hash);

    return isMatch;
  }
}
