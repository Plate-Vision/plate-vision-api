# Projeto Final - Clean Code

Neste projeto, vocês deverão escolher um projeto já desenvolvido em uma disciplina anterior da graduação, refatorá-lo com base nos princípios de Clean Code estudados e apresentar o processo e os resultados.

A apresentação final também é o **seminário da disciplina**. A equipe apresenta o trabalho completo; não há divisão obrigatória de tópicos entre os integrantes.

## Objetivos

- Identificar e eliminar **code smells**;
- Aplicar os princípios do livro **Clean Code** e as boas práticas discutidas em aula;
- Criar uma suíte de testes unitários para cobertura parcial;
- Organizar dependências, modularização e arquitetura;
- Documentar a refatoração em arquivos markdown que sirvam de roteiro da apresentação;
- Apresentar o projeto original, o processo de refatoração e o resultado final.

## Requisitos do projeto

- Formar grupos de **3 a 4 integrantes**;
- Escolher um projeto de médio porte já desenvolvido anteriormente no curso, com **funcionalidades reais** (não serão aceitos scripts pequenos, exercícios ou exemplos);
  - Será considerado médio porte um projeto entre **400 e 800 linhas de código**, medidas com `cloc` ou outra ferramenta reprodutível. A contagem deve ser feita **antes de qualquer refatoração**;
  - A medição deve excluir testes, dependências de terceiros (`node_modules`, `vendor`), arquivos gerados e lockfiles;
  - O projeto deve ser implementado em uma linguagem que suporte testes unitários e ferramentas de linter;
- Identificar **pelo menos 6 code smells relevantes**, cobrindo as **5 categorias** do Tópico 10 (inchaços, abusos de orientação a objetos, impedidores de mudança, dispensáveis e acopladores);
- Aplicar refatorações de **pelo menos 4 grupos diferentes** do catálogo do Tópico 11 (composição de métodos, movimentação de recursos, organização de dados, simplificação de condicionais, simplificação de chamadas e generalização);
- Criar os branches `original` (versão antiga, congelada) e `main` (versão refatorada);
- Implementar uma suíte de testes com cobertura parcial de **cerca de 50%**;
- Integrar o linter em **pelo menos duas etapas** (por exemplo, hook de pré-commit/commit-msg e CI);
- Organizar dependências e acoplamento de forma adequada;
- Incluir `README.md` e `CHANGELOG.md` na raiz do repositório;
- Incluir a documentação da refatoração nos **6 arquivos markdown** descritos abaixo.

## Entregas

### Entrega 01: Dossiê e diagnóstico inicial

Documento markdown contendo:

- Nome dos integrantes e endereço do repositório público;
- Descrição do software, domínio, principais funcionalidades e stack;
- Saída do `cloc` com a contagem de linhas;
- **Baseline** medido: cobertura de testes inicial, avisos do linter e complexidade (se houver ferramenta);
- Hash ou tag do commit que representa a versão original (branch `original`);
- Catálogo inicial de smells (ID, smell, categoria, `arquivo:linha`, impacto);
- Plano de refatoração: técnicas do catálogo, ordem de execução e PRs previstos;
- Ferramentas que serão usadas: linter, formatador, framework de testes, cobertura, CI, hooks e modelos de IA;
- Riscos, limitações e o que **não** será refatorado.

O escopo do projeto precisa ser **aprovado pelo professor** nesta entrega. Projetos fora dos requisitos devem ser substituídos.

### Entrega Final: Repositório, documentação e apresentação

- Repositório público com `original` congelado e `main` refatorado;
- `README.md` e `CHANGELOG.md` (este seguindo o [Keep a Changelog](https://keepachangelog.com/en/1.0.0/));
- Documentação da refatoração nos 6 arquivos descritos abaixo;
- Apresentação de até **10 minutos**, com demonstração do projeto original e do projeto refatorado.

Cada entrega fora do prazo pode gerar penalidade de até 1 ponto na nota final do projeto. A entrega final deve ser feita por meio do repositório público no GitHub, com o endereço enviado também no AVA.

## Documentação da refatoração

A entrega final deve conter **exatamente um arquivo markdown por bloco da apresentação** (mais um índice), dentro da pasta `docs/`:

```text
docs/
├── README.md                         # Índice
├── 01-analise-de-smells.md
├── 02-cobertura-de-testes.md
├── 03-ferramentas.md
├── 04-arquitetura-e-dependencias.md
├── 05-repositorio.md
└── 06-documentacao.md
```

Cada arquivo deve ser objetivo, usar tabelas e links, e terminar com duas seções:

- **Evidências**: links para PRs, commits, comandos ou relatórios que comprovem o que foi afirmado;
- **Roteiro de 1 minuto**: o que será mostrado na apresentação para aquele bloco.

O `docs/README.md` deve listar os 6 arquivos e o bloco da apresentação correspondente. Nenhuma afirmação deve ficar sem evidência. Evite texto genérico.

### `01-analise-de-smells.md`

- Tabela com todos os smells identificados: ID, smell, categoria, `arquivo:linha` e impacto;
- Para os **5 principais**: categoria, trecho “antes”, técnica de refatoração aplicada (nome do catálogo do Tópico 11), trecho “depois”, PR e teste que protege a mudança;
- Métrica de smells eliminados e smells remanescentes.

### `02-cobertura-de-testes.md`

- Framework e comando de execução;
- Número de testes e cobertura de linhas e branches;
- Cobertura por módulo ou pacote;
- Tabela ligando cada teste às refatorações que ele protege;
- O que não está coberto e por quê.

### `03-ferramentas.md`

- Tabela com ferramenta, versão, finalidade, arquivo de configuração e evidência de uso;
- Linter, formatador, testes, cobertura, CI, hooks e validação de commits;
- Uso de IA: modelo utilizado, tarefas em que foi aplicado, como o código gerado foi revisado (Tópico 15) e limitações encontradas.

### `04-arquitetura-e-dependencias.md`

- Diagramas **antes e depois** em Mermaid (versionáveis e renderizáveis no GitHub);
- Direção das dependências, dependências circulares, injeção de dependências e separação de camadas ou módulos;
- Explicação das mudanças estruturais e do impacto na testabilidade;
- Métricas de acoplamento, quando aplicáveis (fan-in, fan-out, instabilidade).

### `05-repositorio.md`

- Organização do trabalho: issues, branches, commits e pull requests;
- Tabela de PRs com autor, revisor, smell relacionado e status;
- Evidência de code review: comentário, correção e aprovação;
- CI/CD (quando aplicável), hooks e proteção de branch;
- Saída de `git log --oneline --graph` e `git shortlog -sn` entre `original` e `main`.

### `06-documentacao.md`

- `README.md` e `CHANGELOG.md` com links;
- Instruções de instalação e execução;
- Licença escolhida e justificativa;
- **Bônus**: ADRs das principais decisões arquiteturais e de refatoração.

## Regras de repositório, versão e revisão

- O branch `original` deve ser congelado no commit registrado na Entrega 01 e protegido contra push;
- O branch `main` só recebe código via **pull request** (proteção de branch com PR obrigatório, pelo menos 1 aprovação e checks verdes);
- Commits devem seguir **Conventional Commits**, validados por `commitlint` no hook `commit-msg` e no CI;
- Deve haver **1 PR por refatoração**, com **pelo menos 6 PRs** no total;
- Cada integrante deve ser autor de **pelo menos 2 PRs** e revisor de **pelo menos 2 PRs** de colegas;
- Todo PR precisa de **pelo menos 1 aprovação de outro integrante**; autoaprovação não conta;
- Cada review deve ter **pelo menos 1 comentário substantivo** apontando código, classificado como bloqueante ou não bloqueante, e resolvido antes do merge;
- O repositório deve conter um template de pull request com checklist: ID do smell, técnica aplicada, teste, lint e cobertura.

As datas de criação e merge dos PRs são parte da evidência de trabalho incremental.

## Apresentação: 10 minutos

A equipe apresenta o trabalho completo, coletivamente. Todos os integrantes devem falar e podem ser questionados sobre os trechos que autoraram.

| **Bloco**                              | **O que mostrar**                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| Contexto                               | Projeto, domínio, escopo e funcionalidades                                                 |
| **Análise de smells**                  | 5 principais smells encontrados, técnicas que foram aplicadas e exemplos diff antes/depois |
| **Cobertura de testes**                | Os principais testes implementados e a cobertura obtida                                    |
| **Ferramentas**                        | Configuração do linter, hooks, CI e modelos de IA utilizados                               |
| **Arquitetura e dependências**         | Diagrama antes/depois e tabela de dependências                                             |
| **Repositório**                        | Issues, `git log`, um PR com review e CI/CD                                                |
| **Documentação**                       | README, CHANGELOG e bônus (ADR/licença)                                                    |
| **Demonstração do projeto refatorado** | Mesmas funcionalidades da demo original                                                    |
| Fechamento                             | Métricas antes/depois                                                                      |

## Cronograma

- **03/11 (Aula 15)** — Lançamento do projeto e formação dos grupos;
- **17/11 (Aula 17)** — Entrega 01: dossiê e diagnóstico inicial;
- **17/11 a 24/11 (Aulas 17 e 18)** — Refatoração, testes e documentação;
- **01/12 (Aula 19)** — Entrega Final e apresentação (N3).

## Regras de escopo e integridade

- O projeto deve ser aprovado na Entrega 01; projetos fora dos requisitos não serão aceitos;
- Refatorar não é reescrever: o comportamento deve ser preservado e o histórico deve mostrar evolução incremental; Se novas funcionalidades forem adicionadas, elas devem ser documentadas e justificadas;
- A versão original deve permanecer executável para a demonstração;
- O uso de IA deve ser declarado, e todo código gerado deve ser revisado por um integrante;
- Cada integrante deve conseguir explicar qualquer trecho que tenha autorado;
- O professor pode sortear um PR por equipe para inspeção durante a apresentação.
