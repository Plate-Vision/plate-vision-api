# Documentação da refatoração de Clean Code

Equipe: **Arthur Ghizi, Augusto Preis e Gabriel Jorge**. Repositório público: [Plate-Vision/plate-vision-api](https://github.com/Plate-Vision/plate-vision-api). Conta que criou os commits e PRs desta entrega: `Arthu085`; os usuários GitHub dos demais integrantes não foram informados.

A API controla acesso veicular e estacionamento com NestJS, TypeScript e TypeORM/PostgreSQL. O recorte cobre leitura de placas, criação de veículo pela IA, criação/atualização de estacionamento e montagem desses serviços. OCR, autenticação, ocorrências, schema e novos recursos não são refatorados funcionalmente; há testes adicionais de comportamentos existentes para medir cobertura global.

## Índice dos seis blocos

| Bloco                        | Arquivo                                                              | Conteúdo técnico                                           |
| ---------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| Smells e diagnóstico inicial | [01-analise-de-smells.md](01-analise-de-smells.md)                   | Dossiê, escopo, baseline, oito smells e cinco comparações  |
| Testes                       | [02-cobertura-de-testes.md](02-cobertura-de-testes.md)               | 185 testes, cobertura global e vínculo com refatorações    |
| Ferramentas                  | [03-ferramentas.md](03-ferramentas.md)                               | Configurações, hooks, CI, commitlint e uso declarado de IA |
| Arquitetura                  | [04-arquitetura-e-dependencias.md](04-arquitetura-e-dependencias.md) | Diagramas antes/depois, DI e métricas de imports           |
| Repositório                  | [05-repositorio.md](05-repositorio.md)                               | Seis PRs reais, branches, proteções, revisão e histórico   |
| Documentação                 | [06-documentacao.md](06-documentacao.md)                             | Setup, demo, ADRs, licença e inventário de arquivos        |

## Métricas e conformidade

| Item                                                       | Original                          | Estado entregue                                                    |
| ---------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| Linhas TypeScript, `cloc`, sem testes/dependências/gerados | 7.564 em 226 arquivos             | 8.014 em 227 arquivos; a formatação muda a contagem física         |
| Recorte funcional                                          | 627 em 12 arquivos                | 608 em 13 arquivos, incluindo o helper                             |
| Lint                                                       | 409 erros e 15 avisos             | 0 erros e 0 avisos                                                 |
| Suíte de testes no repositório                             | Ausente; cobertura não mensurável | 185 testes em 15 suítes                                            |
| Cobertura global                                           | Não disponível                    | 50,47% linhas; 60,19% branches                                     |
| Componentes cíclicos no grafo estático de imports          | 7                                 | 6; inclui imports de tipos, não equivale a ciclos de DI em runtime |
| Branches                                                   | `original` e `main` em `b360df1`  | Nova branch refatorada e cinco branches de revisão; nenhum merge   |
| PRs                                                        | Sem PRs deste trabalho            | Seis abertos, todos por `Arthu085`; aprovações humanas pendentes   |

## Pendências que a equipe precisa resolver

1. Obter aprovação do professor para o recorte, porque o repositório completo excede 800 linhas. A implementação não comprova essa aprovação.
2. Cumprir autoria de pelo menos dois PRs por integrante e revisão de pelo menos dois PRs de colegas. Os seis PRs atuais pertencem à mesma conta.
3. Obter comentário substantivo e aprovação de outro integrante em cada PR; não há aprovação humana registrada nesta entrega.
4. Integrar a versão refatorada na `main` por um PR futuro, somente quando autorizado. A solicitação atual exige mantê-la no estado original.
5. Comprovar a execução remota do CI: o workflow está implementado, mas o GitHub ainda não registrou runs/checks na coleta. A causa não foi confirmada; o gate local passou.
6. Rever as vulnerabilidades registradas e os comportamentos herdados descritos no diagnóstico antes de uma entrega de produção.

## Evidências

- [Baseline reproduzível](../reports/baseline.json), [resultado final](../reports/final.json) e [testes](../reports/test-results.json).
- [Demonstração HTTP/PostgreSQL](../reports/demo-comparison.json), [issue de escopo](https://github.com/Plate-Vision/plate-vision-api/issues/26) e [seis PRs](../reports/delivery.json).
- [Enunciado integral](../task.md), [proteções e commits de `main`/`original`](../reports/repository-state.json) e [inventário](../reports/file-inventory.tsv).
