# 05 — Organização do repositório e revisão

Trabalho agrupado em uma entrega coesa: refatoração do fluxo, testes de preservação, ferramentas e documentação. Os seis PRs existem porque o enunciado exige pelo menos um por refatoração. [Issue de escopo #26](https://github.com/Plate-Vision/plate-vision-api/issues/26).

## Branches e pull requests

`original` está congelada em `b360df12edf9c347f981130fdcd0b61266869822` e bloqueada contra alterações, inclusive para administradores. `main` permanece no mesmo commit por solicitação do usuário. A nova versão completa está em `refactor/clean-code-project`; as cinco branches intermediárias permitem revisar cada etapa.

| Etapa/PR                                                      | Branch                                | Base                                  | Smells   | Autor real | Revisor de equipe | Status            |
| ------------------------------------------------------------- | ------------------------------------- | ------------------------------------- | -------- | ---------- | ----------------- | ----------------- |
| [1](https://github.com/Plate-Vision/plate-vision-api/pull/27) | `refactor/clean-code-01-names`        | `original`                            | S06      | Arthu085   | Pendente          | Aberto, sem merge |
| [2](https://github.com/Plate-Vision/plate-vision-api/pull/28) | `refactor/clean-code-02-period`       | `refactor/clean-code-01-names`        | S03, S04 | Arthu085   | Pendente          | Aberto, sem merge |
| [3](https://github.com/Plate-Vision/plate-vision-api/pull/29) | `refactor/clean-code-03-dependencies` | `refactor/clean-code-02-period`       | S02      | Arthu085   | Pendente          | Aberto, sem merge |
| [4](https://github.com/Plate-Vision/plate-vision-api/pull/30) | `refactor/clean-code-04-processing`   | `refactor/clean-code-03-dependencies` | S01, S05 | Arthu085   | Pendente          | Aberto, sem merge |
| [5](https://github.com/Plate-Vision/plate-vision-api/pull/31) | `refactor/clean-code-05-statuses`     | `refactor/clean-code-04-processing`   | S07      | Arthu085   | Pendente          | Aberto, sem merge |
| [6](https://github.com/Plate-Vision/plate-vision-api/pull/32) | `refactor/clean-code-project`         | `refactor/clean-code-05-statuses`     | S01, S06 | Arthu085   | Pendente          | Aberto, sem merge |

A cadeia começa em `original` **para comparação**, não para merge. Não mesclar o primeiro PR na branch congelada. Após revisão e autorização futura, a integração da versão completa exige um novo PR para `main`. Nenhum dos seis PRs foi mesclado nesta entrega.

Os commits usam Conventional Commits. O commit inicial separa a preparação mecânica dos seis passos semânticos. O ajuste de inicialização do Nest acompanha o PR 3; a suíte global e a documentação acompanham o PR final. Os commits locais de DI foram agrupados antes da publicação, sem force-push, preservando a árvore final verificada.

## Evidência de revisão técnica

| Comentário                                                                                                                         | Classificação         | Correção                                                                                 | Prova                                                                 | Aprovação de outro integrante |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------- |
| [Provider capturado antes da inicialização](https://github.com/Plate-Vision/plate-vision-api/pull/29#pullrequestreview-5864129683) | Bloqueante, resolvido | Injeção normal de VehicleService em ParkingRecordService; montagem aguarda inicialização | Teste real de DI falha antes/passa depois; demo HTTP/PostgreSQL passa | Pendente                      |

O comentário está registrado pela mesma conta `Arthu085` que abriu o PR e documenta uma revisão técnica automatizada. **Não é revisão independente de colega nem aprovação humana.** O [relatório de revisão](../reports/review.json) distingue essas condições. A primeira revisão automatizada não identificou a falha; a demonstração real a encontrou antes da publicação, levando ao teste adicional e à correção.

A equipe informada tem três integrantes, mas todos os seis PRs desta entrega foram criados pela mesma conta. Ainda faltam pelo menos dois PRs autorais por integrante e pelo menos duas revisões reais de colegas por integrante, com comentário substantivo classificado e aprovação em cada PR. Não foram inventados autores, revisores, aprovações ou datas de merge.

## CI, hooks e proteção

O workflow [Quality](../.github/workflows/quality.yml) executa instalação por lockfile, lint, formato, dois typechecks, build e cobertura; em PRs também valida o intervalo de commits. O workflow prevê publicar o artefato `coverage`; ainda não há execução remota registrada. Não há deploy automático.

`main` exige PR com pelo menos **uma aprovação**, check **quality** verde, branch atualizada e resolução das discussões. Administradores também estão sujeitos às regras. Force-push e exclusão estão desabilitados. A proteção de `original` bloqueia atualizações. As configurações reais estão no [snapshot](../reports/repository-state.json); o commit de `main` não mudou.

### Situação observada do CI

O workflow e os hooks estão implementados. Entretanto, Actions está habilitado e as APIs ainda retornam zero workflows/runs e nenhum check nos seis PRs. A execução remota não foi comprovada e sua causa não foi confirmada. O [snapshot](../reports/ci.json) registra essa pendência; o [log local](../reports/verification.txt) comprova os comandos, sem substituí-lo por um check fabricado. A equipe precisa resolver o disparo/registro do CI antes da integração futura na `main`.

## Histórico capturado

O snapshot abaixo vai até o commit de produção/testes anterior à documentação. O comando pode ser repetido para incluir os commits posteriores de documentação.

```text
* bdaa084 test: cover API contracts and enforce partial coverage
* 33286ed refactor: flatten plate processing guards and save calls
* 6d3b24d refactor: replace HTTP status literals with named constants
* e9b711b refactor: extract individual plate processing and shared data
* 28d529f fix: initialize parking providers before plate processing
* 7e9f1f7 refactor: inject focused providers into plate processing
* bdb6047 refactor: centralize parking period validation
* 6c65a9a refactor: name synchronous plate and parking transformations
* 5151995 chore: establish clean code quality gates and baseline tests
```

```text
$ git shortlog -sn original..refactor/clean-code-project
9	Arthu085
```

O intervalo solicitado pelo enunciado, `original..main`, está vazio nesta entrega porque a integração foi adiada explicitamente. Após uma futura integração autorizada, executar também:

```bash
git log --oneline --graph original..main
git shortlog -sn original..main
```

## Evidências

- [Seis PRs e autoria](../reports/delivery.json), [issue](https://github.com/Plate-Vision/plate-vision-api/issues/26), [comentário técnico](https://github.com/Plate-Vision/plate-vision-api/pull/29#pullrequestreview-5864129683) e [proteções](../reports/repository-state.json).
- [Histórico e shortlog](../reports/history.txt), [CI observado](../reports/ci.json), [template](../.github/pull_request_template.md) e [revisão](../reports/review.json).
- `git log --oneline --graph original..refactor/clean-code-project`; `git shortlog -sn original..refactor/clean-code-project`.

## Roteiro de 1 minuto

Mostre `original`, a branch nova e os seis PRs encadeados. Abra o comentário bloqueante de inicialização, sua correção e o resultado local; a execução remota do CI está pendente. Mostre a proteção de branches. Declare as aprovações e quotas de autoria/revisão ainda pendentes; não apresente auto-revisão como aprovação de colega.
