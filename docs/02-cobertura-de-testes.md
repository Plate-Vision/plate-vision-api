# 02 — Testes e cobertura

Framework: Jest **29.7.0**, com ts-jest **29.4.15** e `@nestjs/testing`. Configuração: [jest.config.js](../jest.config.js) e [tsconfig.test.json](../tsconfig.test.json).

```bash
npm test
npm run test:cov
npm run verify
```

## Medição global

**185 testes em 15 suítes passam.** Linhas: **1.172/2.322 (50,47%)**; branches: **245/407 (60,19%)**; statements: **1.241/2.486 (49,91%)**; funções: **200/486 (41,15%)**. O threshold global exige 50% de linhas; as demais métricas são medidas, sem alegação de 50% de funções ou statements.

A coleta inclui todo o TypeScript de produção, inclusive arquivos nunca importados por testes. `roots` inclui `src` e `test`, evitando que o Jest omita módulos não carregados. Somente `main.ts`, migrations, seeds e declarações `.d.ts` são excluídos. A cobertura mede linhas executáveis instrumentadas, por isso o denominador não é o mesmo das 8.014 linhas físicas do `cloc`.

O original não tinha suíte nem comando de cobertura. Os primeiros 53 testes passam tanto em uma cópia exata de `original` quanto na base de caracterização anterior às mudanças semânticas; essa primeira base instrumentada cobria 20,46% das linhas globais. Não se apresenta esse valor como uma suíte já existente na branch congelada.

## Cobertura por módulo

| Módulo/pacote          | Linhas           | Branches                          |
| ---------------------- | ---------------- | --------------------------------- |
| application            | 0/17 (0.00%)     | 0/0 (sem branches instrumentados) |
| core                   | 228/427 (53.40%) | 83/124 (66.94%)                   |
| modules/auth           | 164/244 (67.21%) | 29/29 (100.00%)                   |
| modules/customer       | 146/206 (70.87%) | 20/37 (54.05%)                    |
| modules/occurrence     | 0/227 (0.00%)    | 0/34 (0.00%)                      |
| modules/parking-record | 237/262 (90.46%) | 55/55 (100.00%)                   |
| modules/plate-reading  | 108/122 (88.52%) | 8/8 (100.00%)                     |
| modules/role           | 48/370 (12.97%)  | 4/37 (10.81%)                     |
| modules/user           | 45/207 (21.74%)  | 12/35 (34.29%)                    |
| modules/vehicle        | 179/220 (81.36%) | 30/44 (68.18%)                    |
| shared                 | 17/20 (85.00%)   | 4/4 (100.00%)                     |

O recorte refatorado tem cobertura alta; o fallback sem runner do upsert continua sem execução válida porque o comportamento original falha antes desse trecho. O teste documenta essa falha. A cobertura global permanece parcial e inclui os módulos com baixa cobertura.

## Relação entre testes e mudanças

A tabela relaciona cada suíte ao comportamento protegido. O [relatório de testes](../reports/test-results.json) lista **cada um dos 185 cenários**, com o arquivo, nome completo e resultado.

| Suíte                                                                                | Testes | Refatorações e comportamentos protegidos                                                                                      |
| ------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| [delete-providers.spec.ts](../test/delete-providers.spec.ts)                         | 9      | Comportamento existente de exclusão: UUID/ID válido, ausência de registro e propagação de erro.                               |
| [vehicle-list.spec.ts](../test/vehicle-list.spec.ts)                                 | 3      | Filtros e paginação de veículos existentes.                                                                                   |
| [parking-list.spec.ts](../test/parking-list.spec.ts)                                 | 5      | Filtros e consulta de registros de estacionamento existentes.                                                                 |
| [auth-services.spec.ts](../test/auth-services.spec.ts)                               | 18     | Sem mudança de comportamento: login, usuário inativo, tokens, refresh/reset e recuperação não implementada.                   |
| [transactions.spec.ts](../test/transactions.spec.ts)                                 | 3      | Infraestrutura: commit, rollback e liberação de recursos.                                                                     |
| [controllers.spec.ts](../test/controllers.spec.ts)                                   | 19     | Delegação de controllers e metadados de rota/guards, sem substituir o smoke HTTP real.                                        |
| [configuration-and-validation.spec.ts](../test/configuration-and-validation.spec.ts) | 15     | Sem refatoração dessas configurações: variáveis obrigatórias, pipes e campos JSON.                                            |
| [plate-reading.spec.ts](../test/plate-reading.spec.ts)                               | 18     | S01, S02, S05, S07: lote vazio, ordem serial, veículo de serviço, falha e marcação; cron concorrente e recuperação após erro. |
| [service-wiring.spec.ts](../test/service-wiring.spec.ts)                             | 2      | S02: montagem manual e injeção real do Nest; regressão do provider capturado antes da inicialização.                          |
| [auth-guards.spec.ts](../test/auth-guards.spec.ts)                                   | 22     | Sem refatoração de autenticação: token ausente/inválido, usuário ausente, permissões e propagação do contexto.                |
| [parking-record.spec.ts](../test/parking-record.spec.ts)                             | 30     | S03, S04, S07: regras de veículo, duplicação de entrada, datas, null/undefined, serialização e runner; limites herdados.      |
| [read-providers.spec.ts](../test/read-providers.spec.ts)                             | 18     | Leituras de estacionamento/veículos/clientes por UUID/ID; ausências e QueryRunner.                                            |
| [vehicle-ia.spec.ts](../test/vehicle-ia.spec.ts)                                     | 5      | S02, S06: veículo existente, placa em maiúsculas, mesma transação e criação com transação própria.                            |
| [pagination.spec.ts](../test/pagination.spec.ts)                                     | 8      | Consultas, ordenação, paginação, contagem e resultado vazio.                                                                  |
| [document-validator.spec.ts](../test/document-validator.spec.ts)                     | 10     | S08 remanescente: seleção FI/JU, quantidade de dígitos e mensagens.                                                           |

## Limites da prova

Controllers são testados por delegação; guards, repositórios e providers têm colaboradores simulados. Isso não comprova todas as combinações de autenticação, SQL, upload Cloudinary ou operação concorrente entre processos. O [smoke HTTP/PostgreSQL](../reports/demo-comparison.json) cobre separadamente a montagem real da aplicação e o caminho principal de leituras/estacionamento. O engine OCR e o envio externo de imagens/email não são executados. Seeds/migrations são exercitados pela demo, embora não integrem o denominador unitário.

A falha de DI escapou dos testes com montagem manual e foi encontrada na demo real. O teste com `Test.createTestingModule` foi adicionado para impedir a regressão.

## Evidências

- [Resultado completo por cenário](../reports/test-results.json), [cobertura por arquivo](../reports/coverage-summary.json), [baseline de caracterização](../reports/characterization.json).
- [Log de verificação](../reports/verification.txt), [configuração do threshold](../jest.config.js) e [demo real](../reports/demo-comparison.json).
- `npm run test:cov`; abrir `coverage/lcov-report/index.html`. O workflow prevê a publicação da pasta `coverage`; a execução remota está pendente.

## Roteiro de 1 minuto

Execute os testes ou mostre o log de 185 cenários. Abra um teste de data, um de ordem transacional e o teste real de DI que detecta a falha de inicialização. Mostre a cobertura global e a tabela por módulo. Explique as exclusões e o que a cobertura parcial ainda não prova.
