# 03 — Ferramentas, automação e uso de IA

As versões são as resolvidas no [lockfile](../package-lock.json), não somente os intervalos do manifesto. A instalação limpa com `npm ci` e o gate completo foram executados.

| Ferramenta     | Versão medida                                              | Finalidade                                                 | Configuração/evidência                                                                       |
| -------------- | ---------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Node.js / npm  | 24.18.0 / 11.16.0 local                                    | Runtime e instalação reproduzível                          | [Log](../reports/verification.txt); CI usa Node 22 atualizado                                |
| ESLint         | 8.57.1                                                     | Erros e avisos de TypeScript; gate sem autofix             | [.eslintrc.js](../.eslintrc.js), `npm run lint`                                              |
| Prettier       | 3.10.0                                                     | Formatação consistente                                     | [.prettierrc](../.prettierrc), [.prettierignore](../.prettierignore), `npm run format:check` |
| TypeScript     | 5.9.3                                                      | Typecheck separado da aplicação e testes                   | [tsconfig.json](../tsconfig.json), [tsconfig.test.json](../tsconfig.test.json)               |
| Jest / ts-jest | 29.7.0 / 29.4.15                                           | Testes e instrumentação de cobertura                       | [jest.config.js](../jest.config.js), `npm run test:cov`                                      |
| Husky          | 9.1.7                                                      | Integração dos hooks após `npm ci`                         | [.husky/pre-commit](../.husky/pre-commit), [.husky/commit-msg](../.husky/commit-msg)         |
| lint-staged    | 15.5.2                                                     | ESLint e Prettier somente nos arquivos TypeScript staged   | [package.json](../package.json), chave `lint-staged`                                         |
| commitlint     | 19.8.1                                                     | Conventional Commits no hook e no CI                       | [commitlint.config.js](../commitlint.config.js)                                              |
| cloc           | pacote 2.6.0, CLI 1.86                                     | Contagem anterior e posterior                              | [script](../scripts/project-report.cjs), [baseline](../reports/baseline.json)                |
| GitHub Actions | arquivo versionado; checkout/setup-node/upload-artifact v4 | Lint, formato, typecheck, build, cobertura e commits do PR | [quality.yml](../.github/workflows/quality.yml)                                              |
| PostgreSQL     | 18.6 na validação                                          | Smoke HTTP com migrations/seeds originais                  | [demo](../reports/demo-comparison.json); imagem padrão do script `postgres:18`               |

## Duas etapas do linter e validação dos commits

1. `pre-commit` chama lint-staged: arquivos staged passam por ESLint com correção e Prettier. O commit falha se restarem erros ou avisos.
2. O CI executa `npm ci` e `npm run verify`, incluindo lint de `src` e `test` sem autofix e com `--max-warnings=0`.

O hook `commit-msg` valida a mensagem; o CI valida o intervalo real entre `base.sha` e `head.sha` do PR, com histórico completo (`fetch-depth: 0`). Foram exercitados um título válido e um inválido; não há alegação de validação de todos os commits históricos anteriores a `original`.

```bash
printf 'refactor: clarify parking mapping
' | npx --no -- commitlint
printf 'invalid commit
' | npx --no -- commitlint
```

O segundo comando deve falhar. Os hooks foram executados nos commits desta entrega. O template exige IDs, técnica, testes, lint, cobertura e revisão de outro integrante.

## Execução remota pendente

O GitHub informa Actions habilitado e o arquivo de workflow está presente nas branches publicadas, mas as APIs retornaram **zero workflows registrados, zero runs e nenhum check** para os seis PRs no momento da coleta. Não se apresenta CI remoto verde nem artefato publicado como evidência realizada. A causa não foi confirmada. A mesma sequência do workflow passou localmente após instalação limpa. É necessário verificar o registro/disparo em Actions antes da entrega final, preservando a restrição de não enviar código para `main`. [Snapshot](../reports/ci.json).

## Dependências e reprodutibilidade

Jest e tipos tornam explícita a suíte solicitada; ts-jest e `@nestjs/testing` já pertenciam à stack. Husky, lint-staged e commitlint atendem aos gates exigidos. cloc torna a contagem reproduzível. UUID e dotenv passam a ser dependências diretas porque a produção já os importava transitivamente. Não há novo framework de negócio, ORM ou camada genérica.

O audit do lockfile registra **75 vulnerabilidades: 11 baixas, 51 moderadas e 13 altas**. Não se atribui a origem de todas elas à versão original, pois não havia lockfile versionado. Upgrades amplos são uma pendência separada, não uma garantia de segurança desta entrega.

## Uso declarado de IA

Ferramenta: **Codex, baseado em GPT-6**, com agentes de implementação e revisão técnica automatizada. Não se atribui uma variante exata de infraestrutura não exposta pela sessão.

A IA auxiliou no diagnóstico, testes de caracterização, refatorações, configuração de gates, inspeção de diffs, comparação HTTP/PostgreSQL e redação dos documentos. O código foi verificado por lint, typecheck, testes e execução real. A revisão automatizada inicial não encontrou o problema de inicialização; a demo HTTP o expôs, um teste com DI real o reproduziu, e a injeção foi corrigida. Isso evidencia a limitação dos mocks e da revisão automatizada isolada.

**Revisão por integrante ainda pendente.** A conta de entrega é `Arthu085`; os documentos não afirmam que Augusto ou Gabriel revisaram ou aprovaram código. Cada integrante precisa ler o diff, executar os testes, explicar as mudanças e registrar suas revisões reais antes da entrega acadêmica.

## Evidências

- [Configurações e scripts](../package.json), [CI](../.github/workflows/quality.yml), [template](../.github/pull_request_template.md) e [versões medidas](../reports/final.json).
- [Verificação após instalação limpa](../reports/verification.txt), [audit](../reports/dependency-audit.json) e [revisão técnica](../reports/review.json).
- [PRs e autoria](../reports/delivery.json); execuções do CI acessíveis nas abas Checks dos PRs e em [Actions](https://github.com/Plate-Vision/plate-vision-api/actions).

## Roteiro de 1 minuto

Abra `package.json`, os dois hooks e `quality.yml`. Mostre o linter no pre-commit e no CI, um commit inválido rejeitado, o resultado local e o threshold de 50%. Declare o uso de GPT-6/Codex e explique como a demonstração real encontrou uma falha que a revisão automatizada não detectou.
