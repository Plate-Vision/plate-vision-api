export class DatabaseVariablesProvider {
  public constructor(
    /**
     * Host da conexão com a base de dados
     */
    public host: string,

    /**
     * Porta da conexão com a base de dados
     */
    public port: number,

    /**
     * Nome da base de dados que será realizado a conexão com a base de dados
     */
    public name: string,

    /**
     * Usuário da conexão com a base de dados
     */
    public user: string,

    /**
     * Senha do usuário que será realizado a conexão com a base de dados
     */
    public pass: string,
  ) {}
}
