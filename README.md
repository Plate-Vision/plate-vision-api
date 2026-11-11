# Plate Vision API

API de controle de acesso veicular construída com NestJS, TypeScript e TypeORM. Gerencia clientes, veículos, leituras de placas, entradas/saídas de estacionamento, ocorrências, usuários e permissões. O processamento de leituras pode ser disparado por HTTP ou pelo cron de cinco segundos. O reconhecimento da imagem pertence ao engine externo, opcional nesta API.

## Refatoração de Clean Code

- Estado original congelado: [`original` em `b360df1`](https://github.com/Plate-Vision/plate-vision-api/tree/original).
- Estado refatorado: [`refactor/clean-code-project`](https://github.com/Plate-Vision/plate-vision-api/tree/refactor/clean-code-project).
- A `main` permanece no commit original. Os seis PRs estão encadeados para revisão; não foram mesclados.
- Equipe: Arthur Ghizi, Augusto Preis e Gabriel Jorge.
- Escopo: **627 linhas originais em 12 arquivos**, com **608 linhas em 13 arquivos** após a refatoração, incluindo o novo helper. A API original completa tem **7.564 linhas**; a aprovação desse recorte pelo professor está pendente.
- Resultado: **185 testes**, **50,47% das linhas** e **60,19% dos branches** da API cobertos. O gate exige pelo menos 50% das linhas globais.

O [índice da documentação](docs/README.md) reúne os seis blocos técnicos, as evidências, as pendências acadêmicas e os links dos PRs. O [inventário completo](reports/file-inventory.tsv) identifica cada arquivo criado ou alterado. As mudanças estão no [CHANGELOG](CHANGELOG.md).

## Instalação e execução local

Validação realizada com Node.js **24.18.0**, npm **11.16.0** e PostgreSQL **18.6**. Os pacotes de desenvolvimento precisam de Node 22.13 ou superior na linha 22. O CI usa Node 22 atualizado.

```bash
npm ci
cp .env.example .env
```

Ajuste o `.env` para o seu banco e ambiente. As variáveis obrigatórias são `NODE_ENV`, `API_URL`, `API_PORT`, `API_DOC_PASS`, `API_AUTH_TOKEN`, `API_CLIENT_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER` e `DATABASE_PASS`. O exemplo herdado aponta para um host remoto: troque-o pelo seu PostgreSQL antes de executar migrations. As variáveis `CLOUDINARY_*` são usadas pelas imagens de ocorrências.

```bash
npm run migration:run
npm run seed:run
npm run start:dev
```

A API usa o prefixo `/api`; o Swagger está em `/doc` e o JSON em `/doc-json`, sem o prefixo. Use a porta de `API_PORT`. O seed original cria um usuário de demonstração; use-o somente em um banco local descartável, conforme a [documentação de execução](docs/06-documentacao.md).

## Verificações

```bash
npm run verify
npm run test:cov
npm run report:baseline
npm run report
```

`verify` executa lint sem alterações, formatação, typecheck da aplicação e dos testes, build e cobertura. `lint:fix` corrige arquivos explicitamente. Os relatórios locais detalhados de cobertura ficam em `coverage/`, inclusive `coverage/lcov-report/index.html`; o workflow prevê publicar essa pasta quando executar. A execução remota está pendente: as APIs do GitHub ainda não registraram runs/checks, conforme [reports/ci.json](reports/ci.json). `reports/` contém as medições versionadas. O relatório original usa `git archive original`, preservando o checkout e o banco existentes.

## Demonstração original versus refatorado

Com Docker disponível e as portas locais 55432, 55001 e 55002 livres:

```bash
npm run demo:compare
```

O comando inicia um PostgreSQL descartável com acesso apenas por localhost, arquiva o código original em uma pasta temporária, aplica suas migrations/seeds existentes, executa as duas APIs em sequência e compara autenticação, leitura de placas, entrada/saída, veículo de serviço e marcação das leituras. Ambas usam as dependências do lockfile atual para isolar a comparação do código. O script remove apenas o container, o volume e a pasta temporária que criou. Não inicia o OCR/engine nem usa o seu `.env` para escolher o banco. O resultado fica em [reports/demo-comparison.json](reports/demo-comparison.json).

A imagem padrão é `postgres:18`; para repetir com uma imagem local específica, defina `DEMO_POSTGRES_IMAGE`. Cada execução usa dados sintéticos em um banco novo.

## Docker Compose herdado

```bash
docker compose up -d --build
```

Para incluir o engine, disponibilize `../plate-vision-engine` e use `docker compose --profile engine up -d --build`. Alinhe `API_PORT=5000` e `DATABASE_HOST=db` no ambiente desse Compose. A configuração herdada instala dependências como root e usa Node 22.12.0, que gera aviso de engine para as ferramentas atuais; essa configuração não foi modernizada neste recorte. A validação reproduzível desta entrega é a execução local e `demo:compare`.

## Migrations e seeds

```bash
npm_config_name=NAME npm run migration:generate
npm_config_name=NAME npm run migration:generate:clear
npm run migration:revert
npm_config_name=NAME npm run seed:create
```

Esses comandos alteram o banco configurado. A refatoração preserva o esquema e o conteúdo SQL das migrations; os arquivos afetados recebem somente formatação.

## Limitações e licença

A [análise](docs/01-analise-de-smells.md) registra comportamentos herdados preservados, a aprovação de escopo e as revisões humanas pendentes. O [audit de dependências](reports/dependency-audit.json) registra 75 vulnerabilidades, incluindo 13 altas; atualizações amplas ficaram fora da refatoração. O manifesto mantém `UNLICENSED`; nenhuma licença open source foi concedida nesta entrega.
