# 06 — Documentação, execução e inventário

O [README](../README.md) documenta o domínio, instalação, comandos e limitações. O [CHANGELOG](../CHANGELOG.md) usa Keep a Changelog com seção `Unreleased`, sem inventar uma versão publicada ou uma data de release. O [enunciado](../task.md) é preservado para rastrear os requisitos.

## Instalar e executar

```bash
npm ci
cp .env.example .env
```

Configure um banco local e as variáveis descritas no README antes de executar:

```bash
npm run migration:run
npm run seed:run
npm run start:dev
```

Use a porta definida em `API_PORT`. Swagger: `/doc`; API: `/api`. O exemplo herdado contém host remoto e não está pronto para o banco local sem ajuste. O Compose original permanece como alternativa herdada, com as limitações de versão/permissão documentadas no README.

## Demonstração reproduzível

```bash
npm run demo:compare
```

Pré-requisitos: Node e dependências instalados, Docker em execução, portas locais 55432/55001/55002 livres. O script cria seu próprio PostgreSQL, usa `git archive original`, executa migrations/seeds existentes e inicia original/refatorado em sequência, com dependências iguais. Dados são sintéticos; o seed de demonstração original (`master@email.com` / `master1234`) existe apenas nesse banco descartável. Esses valores não são credenciais de produção nem são usados contra o ambiente do usuário.

| Ação demonstrada                                | Resultado em ambas as versões                                         |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| Acessar processamento sem token                 | HTTP 401                                                              |
| Login com seed local                            | HTTP 201, token utilizado somente em memória                          |
| Abrir Swagger JSON                              | HTTP 200, 21 caminhos                                                 |
| Inserir duas leituras sintéticas da mesma placa | Um veículo com placa em maiúsculas e origem AI                        |
| Processar as leituras                           | Um registro com entrada e saída AI e referências corretas às leituras |
| Inserir leitura de veículo de serviço           | Nenhum estacionamento para esse veículo                               |
| Conferir marcação                               | Três leituras processadas                                             |
| Repetir processamento sem novos dados           | HTTP 200 e `Nenhum dado para atualizar`                               |
| Listar estacionamentos autenticado              | HTTP 200                                                              |

O comando compara os dois objetos de resultados e falha se divergem. O [teste de limpeza após porta ocupada](../reports/demo-cleanup.json) também confirmou que uma falha ao iniciar o banco não deixa containers da tarefa para trás. A limpeza remove somente os recursos criados pelo script. O relatório registra a imagem usada; a validação desta entrega usou PostgreSQL 18.6. O engine OCR não participa da demo, portanto a equipe deve dizer que são leituras sintéticas.

## Decisões registradas — ADRs

| Decisão                                              | Contexto e escolha                                                                              | Consequência                                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| ADR-01: preservar o recorte e contratos              | Refatorar o fluxo de 627 linhas, mantendo DTOs públicos, mensagens, datas, ordem e transações   | Testes caracterizam inclusive comportamentos herdados; aprovação do recorte pelo professor continua necessária          |
| ADR-02: colaboradores específicos sem novo framework | Usar os providers já existentes, construídos pelas fachadas do projeto                          | Dependências ficam explícitas; Nest continua injetando serviços/repositories; teste real protege inicialização          |
| ADR-03: medir cobertura global                       | Incluir módulos sem testes; excluir somente bootstrap, migrations/seeds e declarações           | 50,47% global é reproduzível; não se confunde a cobertura alta do recorte com a API inteira                             |
| ADR-04: conservar licenciamento                      | O manifesto original já declara `UNLICENSED`; não há autorização para conceder uma nova licença | Nenhuma licença open source ou arquivo LICENSE foi criado; a equipe deve decidir separadamente caso queira alterar isso |
| ADR-05: separar comparação e integração              | O usuário pediu original preservado e nova branch sem enviar código a main                      | PRs encadeados servem à revisão; futura integração na main depende de autorização e aprovações reais                    |

## Todos os arquivos criados e alterados

O [inventário TSV](../reports/file-inventory.tsv) registra o status Git (`A` criado, `M` alterado), o caminho completo relativo e a finalidade de **57 arquivos criados e 51 alterados; 108 arquivos no total.** Nenhum arquivo removido.

| Status | Arquivo                                                                                                                                                                                             | Finalidade                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| M      | [`.eslintrc.js`](../.eslintrc.js)                                                                                                                                                                   | Quality tooling, dependency lock or automation |
| A      | [`.github/pull_request_template.md`](../.github/pull_request_template.md)                                                                                                                           | Quality tooling, dependency lock or automation |
| A      | [`.github/workflows/quality.yml`](../.github/workflows/quality.yml)                                                                                                                                 | Quality tooling, dependency lock or automation |
| M      | [`.gitignore`](../.gitignore)                                                                                                                                                                       | Quality tooling, dependency lock or automation |
| A      | [`.husky/commit-msg`](../.husky/commit-msg)                                                                                                                                                         | Quality tooling, dependency lock or automation |
| A      | [`.husky/pre-commit`](../.husky/pre-commit)                                                                                                                                                         | Quality tooling, dependency lock or automation |
| A      | [`.prettierignore`](../.prettierignore)                                                                                                                                                             | Quality tooling, dependency lock or automation |
| A      | [`CHANGELOG.md`](../CHANGELOG.md)                                                                                                                                                                   | Refactoring and technical documentation        |
| A      | [`commitlint.config.js`](../commitlint.config.js)                                                                                                                                                   | Quality tooling, dependency lock or automation |
| A      | [`docs/01-analise-de-smells.md`](../docs/01-analise-de-smells.md)                                                                                                                                   | Refactoring and technical documentation        |
| A      | [`docs/02-cobertura-de-testes.md`](../docs/02-cobertura-de-testes.md)                                                                                                                               | Refactoring and technical documentation        |
| A      | [`docs/03-ferramentas.md`](../docs/03-ferramentas.md)                                                                                                                                               | Refactoring and technical documentation        |
| A      | [`docs/04-arquitetura-e-dependencias.md`](../docs/04-arquitetura-e-dependencias.md)                                                                                                                 | Refactoring and technical documentation        |
| A      | [`docs/05-repositorio.md`](../docs/05-repositorio.md)                                                                                                                                               | Refactoring and technical documentation        |
| A      | [`docs/06-documentacao.md`](../docs/06-documentacao.md)                                                                                                                                             | Refactoring and technical documentation        |
| A      | [`docs/README.md`](../docs/README.md)                                                                                                                                                               | Refactoring and technical documentation        |
| A      | [`jest.config.js`](../jest.config.js)                                                                                                                                                               | Quality tooling, dependency lock or automation |
| A      | [`package-lock.json`](../package-lock.json)                                                                                                                                                         | Quality tooling, dependency lock or automation |
| M      | [`package.json`](../package.json)                                                                                                                                                                   | Quality tooling, dependency lock or automation |
| M      | [`README.md`](../README.md)                                                                                                                                                                         | Refactoring and technical documentation        |
| A      | [`reports/architecture.json`](../reports/architecture.json)                                                                                                                                         | Measured evidence                              |
| A      | [`reports/baseline.json`](../reports/baseline.json)                                                                                                                                                 | Measured evidence                              |
| A      | [`reports/characterization.json`](../reports/characterization.json)                                                                                                                                 | Measured evidence                              |
| A      | [`reports/ci.json`](../reports/ci.json)                                                                                                                                                             | Measured evidence                              |
| A      | [`reports/coverage-summary.json`](../reports/coverage-summary.json)                                                                                                                                 | Measured evidence                              |
| A      | [`reports/delivery.json`](../reports/delivery.json)                                                                                                                                                 | Measured evidence                              |
| A      | [`reports/demo-cleanup.json`](../reports/demo-cleanup.json)                                                                                                                                         | Measured evidence                              |
| A      | [`reports/demo-comparison.json`](../reports/demo-comparison.json)                                                                                                                                   | Measured evidence                              |
| A      | [`reports/demo-original.json`](../reports/demo-original.json)                                                                                                                                       | Measured evidence                              |
| A      | [`reports/demo-refactored.json`](../reports/demo-refactored.json)                                                                                                                                   | Measured evidence                              |
| A      | [`reports/dependency-audit.json`](../reports/dependency-audit.json)                                                                                                                                 | Measured evidence                              |
| A      | [`reports/file-inventory.tsv`](../reports/file-inventory.tsv)                                                                                                                                       | Measured evidence                              |
| A      | [`reports/final.json`](../reports/final.json)                                                                                                                                                       | Measured evidence                              |
| A      | [`reports/history.txt`](../reports/history.txt)                                                                                                                                                     | Measured evidence                              |
| A      | [`reports/repository-state.json`](../reports/repository-state.json)                                                                                                                                 | Measured evidence                              |
| A      | [`reports/review.json`](../reports/review.json)                                                                                                                                                     | Measured evidence                              |
| A      | [`reports/test-results.json`](../reports/test-results.json)                                                                                                                                         | Measured evidence                              |
| A      | [`reports/verification.txt`](../reports/verification.txt)                                                                                                                                           | Measured evidence                              |
| A      | [`scripts/architecture-report.cjs`](../scripts/architecture-report.cjs)                                                                                                                             | Reproducible reports                           |
| A      | [`scripts/demo-compare.cjs`](../scripts/demo-compare.cjs)                                                                                                                                           | Reproducible reports                           |
| A      | [`scripts/demo-flow.cjs`](../scripts/demo-flow.cjs)                                                                                                                                                 | Reproducible reports                           |
| A      | [`scripts/file-inventory.cjs`](../scripts/file-inventory.cjs)                                                                                                                                       | Reproducible reports                           |
| A      | [`scripts/project-report.cjs`](../scripts/project-report.cjs)                                                                                                                                       | Reproducible reports                           |
| M      | [`src/core/base/decorators/endpoint.decorator.ts`](../src/core/base/decorators/endpoint.decorator.ts)                                                                                               | Mechanical formatting or lint cleanup          |
| M      | [`src/core/config/security/security.config.ts`](../src/core/config/security/security.config.ts)                                                                                                     | Mechanical formatting or lint cleanup          |
| M      | [`src/core/config/validator/validator-pipe.config.ts`](../src/core/config/validator/validator-pipe.config.ts)                                                                                       | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1733939707701-create-user-table.ts`](../src/core/database/migrations/1733939707701-create-user-table.ts)                                                             | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1733962676133-create-role-and-ability-table.ts`](../src/core/database/migrations/1733962676133-create-role-and-ability-table.ts)                                     | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1733969260373-add-user-role-relation.ts`](../src/core/database/migrations/1733969260373-add-user-role-relation.ts)                                                   | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1758994237853-create-customer-table.ts`](../src/core/database/migrations/1758994237853-create-customer-table.ts)                                                     | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1758994394770-create-vehicle-table.ts`](../src/core/database/migrations/1758994394770-create-vehicle-table.ts)                                                       | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1758994670108-create-plate-reading-table.ts`](../src/core/database/migrations/1758994670108-create-plate-reading-table.ts)                                           | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1758994749117-create-parking-record-table.ts`](../src/core/database/migrations/1758994749117-create-parking-record-table.ts)                                         | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1758995241638-create-uuid-column.ts`](../src/core/database/migrations/1758995241638-create-uuid-column.ts)                                                           | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1758996899110-create-index-for-uuid-column.ts`](../src/core/database/migrations/1758996899110-create-index-for-uuid-column.ts)                                       | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1759965119360-create-occurrence-table.ts`](../src/core/database/migrations/1759965119360-create-occurrence-table.ts)                                                 | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1760493332598-add-customer-ability.ts`](../src/core/database/migrations/1760493332598-add-customer-ability.ts)                                                       | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1760493449842-add-vehicle-ability.ts`](../src/core/database/migrations/1760493449842-add-vehicle-ability.ts)                                                         | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1761401356193-add-dashboard-ability.ts`](../src/core/database/migrations/1761401356193-add-dashboard-ability.ts)                                                     | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1761401476259-add-occurrence-ability.ts`](../src/core/database/migrations/1761401476259-add-occurrence-ability.ts)                                                   | Mechanical formatting or lint cleanup          |
| M      | [`src/core/database/migrations/1763600004447-change-ability-name.ts`](../src/core/database/migrations/1763600004447-change-ability-name.ts)                                                         | Mechanical formatting or lint cleanup          |
| M      | [`src/core/enviroment-variables/providers/enviroment-variables.provider.ts`](../src/core/enviroment-variables/providers/enviroment-variables.provider.ts)                                           | Mechanical formatting or lint cleanup          |
| M      | [`src/core/enviroment-variables/providers/variables/application-variables.provider.ts`](../src/core/enviroment-variables/providers/variables/application-variables.provider.ts)                     | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/auth/domain/services/providers/password-recovery.provider.ts`](../src/modules/auth/domain/services/providers/password-recovery.provider.ts)                                           | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/occurrence/domain/services/providers/create-occurrence.provider.ts`](../src/modules/occurrence/domain/services/providers/create-occurrence.provider.ts)                               | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/occurrence/domain/services/providers/delete-image.provider.ts`](../src/modules/occurrence/domain/services/providers/delete-image.provider.ts)                                         | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/parking-record/domain/dtos/find-many-parking-record.dto.ts`](../src/modules/parking-record/domain/dtos/find-many-parking-record.dto.ts)                                               | Mechanical formatting or lint cleanup          |
| A      | [`src/modules/parking-record/domain/services/helpers/validate-parking-period.ts`](../src/modules/parking-record/domain/services/helpers/validate-parking-period.ts)                                 | Flow refactoring or service wiring             |
| M      | [`src/modules/parking-record/domain/services/parking-record.service.ts`](../src/modules/parking-record/domain/services/parking-record.service.ts)                                                   | Flow refactoring or service wiring             |
| M      | [`src/modules/parking-record/domain/services/providers/create-parking-record-manual.provider.ts`](../src/modules/parking-record/domain/services/providers/create-parking-record-manual.provider.ts) | Flow refactoring or service wiring             |
| M      | [`src/modules/parking-record/domain/services/providers/find-many-parking-record.provider.ts`](../src/modules/parking-record/domain/services/providers/find-many-parking-record.provider.ts)         | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/parking-record/domain/services/providers/update-parking-record-ia.provider.ts`](../src/modules/parking-record/domain/services/providers/update-parking-record-ia.provider.ts)         | Flow refactoring or service wiring             |
| M      | [`src/modules/parking-record/domain/services/providers/update-parking-record-manual.provider.ts`](../src/modules/parking-record/domain/services/providers/update-parking-record-manual.provider.ts) | Flow refactoring or service wiring             |
| M      | [`src/modules/parking-record/domain/services/providers/upsert-parking-record-ia.provider.ts`](../src/modules/parking-record/domain/services/providers/upsert-parking-record-ia.provider.ts)         | Flow refactoring or service wiring             |
| M      | [`src/modules/plate-reading/domain/services/plate-reading.service.ts`](../src/modules/plate-reading/domain/services/plate-reading.service.ts)                                                       | Flow refactoring or service wiring             |
| M      | [`src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts`](../src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts)             | Flow refactoring or service wiring             |
| M      | [`src/modules/plate-reading/domain/services/providers/update-plate-reading.provider.ts`](../src/modules/plate-reading/domain/services/providers/update-plate-reading.provider.ts)                   | Flow refactoring or service wiring             |
| M      | [`src/modules/role/domain/services/ability.service.ts`](../src/modules/role/domain/services/ability.service.ts)                                                                                     | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/role/domain/services/providers/delete-role.provider.ts`](../src/modules/role/domain/services/providers/delete-role.provider.ts)                                                       | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/role/domain/services/providers/update-role.provider.ts`](../src/modules/role/domain/services/providers/update-role.provider.ts)                                                       | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/role/domain/services/role.service.ts`](../src/modules/role/domain/services/role.service.ts)                                                                                           | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/role/infra/repositories/ability.repository.ts`](../src/modules/role/infra/repositories/ability.repository.ts)                                                                         | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/role/infra/repositories/role-ability.repository.ts`](../src/modules/role/infra/repositories/role-ability.repository.ts)                                                               | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/role/infra/repositories/role.repository.ts`](../src/modules/role/infra/repositories/role.repository.ts)                                                                               | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/user/domain/services/providers/find-many-user.provider.ts`](../src/modules/user/domain/services/providers/find-many-user.provider.ts)                                                 | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/vehicle/domain/dtos/create-vehicle.dto.ts`](../src/modules/vehicle/domain/dtos/create-vehicle.dto.ts)                                                                                 | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/vehicle/domain/services/providers/create-vehicle-ia.provider.ts`](../src/modules/vehicle/domain/services/providers/create-vehicle-ia.provider.ts)                                     | Flow refactoring or service wiring             |
| M      | [`src/modules/vehicle/domain/services/providers/create-vehicle-manual.provider.ts`](../src/modules/vehicle/domain/services/providers/create-vehicle-manual.provider.ts)                             | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/vehicle/domain/services/providers/find-one-vehicle.provider.ts`](../src/modules/vehicle/domain/services/providers/find-one-vehicle.provider.ts)                                       | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/vehicle/domain/services/providers/update-vehicle.provider.ts`](../src/modules/vehicle/domain/services/providers/update-vehicle.provider.ts)                                           | Mechanical formatting or lint cleanup          |
| M      | [`src/modules/vehicle/domain/services/vehicle.service.ts`](../src/modules/vehicle/domain/services/vehicle.service.ts)                                                                               | Flow refactoring or service wiring             |
| A      | [`task.md`](../task.md)                                                                                                                                                                             | Refactoring and technical documentation        |
| A      | [`test/auth-guards.spec.ts`](../test/auth-guards.spec.ts)                                                                                                                                           | Regression tests or test support               |
| A      | [`test/auth-services.spec.ts`](../test/auth-services.spec.ts)                                                                                                                                       | Regression tests or test support               |
| A      | [`test/configuration-and-validation.spec.ts`](../test/configuration-and-validation.spec.ts)                                                                                                         | Regression tests or test support               |
| A      | [`test/controllers.spec.ts`](../test/controllers.spec.ts)                                                                                                                                           | Regression tests or test support               |
| A      | [`test/delete-providers.spec.ts`](../test/delete-providers.spec.ts)                                                                                                                                 | Regression tests or test support               |
| A      | [`test/document-validator.spec.ts`](../test/document-validator.spec.ts)                                                                                                                             | Regression tests or test support               |
| A      | [`test/pagination.spec.ts`](../test/pagination.spec.ts)                                                                                                                                             | Regression tests or test support               |
| A      | [`test/parking-list.spec.ts`](../test/parking-list.spec.ts)                                                                                                                                         | Regression tests or test support               |
| A      | [`test/parking-record.spec.ts`](../test/parking-record.spec.ts)                                                                                                                                     | Regression tests or test support               |
| A      | [`test/plate-reading.spec.ts`](../test/plate-reading.spec.ts)                                                                                                                                       | Regression tests or test support               |
| A      | [`test/read-providers.spec.ts`](../test/read-providers.spec.ts)                                                                                                                                     | Regression tests or test support               |
| A      | [`test/service-wiring.spec.ts`](../test/service-wiring.spec.ts)                                                                                                                                     | Regression tests or test support               |
| A      | [`test/transactions.spec.ts`](../test/transactions.spec.ts)                                                                                                                                         | Regression tests or test support               |
| A      | [`test/vehicle-ia.spec.ts`](../test/vehicle-ia.spec.ts)                                                                                                                                             | Regression tests or test support               |
| A      | [`test/vehicle-list.spec.ts`](../test/vehicle-list.spec.ts)                                                                                                                                         | Regression tests or test support               |
| A      | [`tsconfig.test.json`](../tsconfig.test.json)                                                                                                                                                       | Quality tooling, dependency lock or automation |

## Evidências

- [README](../README.md), [CHANGELOG](../CHANGELOG.md), [inventário](../reports/file-inventory.tsv) e [enunciado](../task.md).
- [Script de comparação](../scripts/demo-compare.cjs), [cenários HTTP/SQL](../scripts/demo-flow.cjs) e [resultado comparado](../reports/demo-comparison.json).
- `npm run report:baseline`; `npm run report`; `npm run demo:compare`; `git diff --name-status original...refactor/clean-code-project`.
