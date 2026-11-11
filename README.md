## Descrição

Aplicação back-end com NestJS, TypeORM e Typescript.

## Instalação e execução

### Com Docker

Por padrão, apenas a API e o banco de dados são iniciados:

```bash
$ docker compose up -d --build
```

Para iniciar também o engine, disponibilize o repositório `plate-vision-engine` em `../plate-vision-engine` e habilite o profile `engine`:

```bash
$ docker compose --profile engine up -d --build
```

### Sem Docker

```bash
# Instalar dependencias
$ npm install

# Desenvolvimento
$ npm run start

# Desenvolvimento (Watch Mode)
$ npm run start:dev

# Produção
$ npm run start:prod
```

## Criando e executando migrações

```bash
# Executar migrações pendentes
$ npm run migration:run

# Criar novas migrações com base nas mudanças nas entidades
$ npm run migration:generate -name=NOME_DA_MIGRATION

# Criar novas migrações sem nenhum conteúdo
$ npm run migration:generate:clear -name=NOME_DA_MIGRATION

# Revertar última migração executada
$ npm run migration:revert
```

## Criando e executando seeds

```bash
# Executar seeds pendentes
$ npm run seed:run

# Criar novas seeds






```

## Configurações de VSCode recomendadas:

```json

"editor.formatOnSave": true,
"prettier.requireConfig": true,
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}

```
