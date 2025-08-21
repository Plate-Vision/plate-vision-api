export class ApplicationVariablesProvider {
  public constructor(
    /**
     * Variável para definir a url em que a aplicação será executada
     */
    public url: string,
    
    /**
     * Variável para definir a porta em que a aplicação receberá as requisições
     */
    public port: number,

    /**
     * Variável para definir a senha da documentação da API
     */
    public docPass: string,

    /**
     * Variável para definir o token de criptografia do JWT
     */
    public authToken: string,

    /**
     * Variável para definir a URL da aplicação client
     */
    public client: string,
  ) {}
}
