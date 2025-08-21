export class MailVariablesProvider {
  public constructor(
    /**
     * Variável para definição do host do servidor SMTP para envio de emails
     */
    public host: string,

    /**
     * Variável para definição da porta de conexão do servidor SMTP para envio de emails
     */
    public port: number,

    /**
     * Variável para definição da senha de acesso ao servidor
     */
    public pass: string,

    /**
     * Variável para  definição do usuário de acesso ao servidor
     */
    public user: string,

    /**
     * Variável para definir email que será descrito como quem enviou o respectivo email
     */
    public from: string,
  ) {}
}
