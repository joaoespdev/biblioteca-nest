<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">API REST desenvolvida em NestJS para gerenciar o sistema de aluguel de livros de uma biblioteca escolar. Esta API permite o gerenciamento de livros, autores, locatários e aluguéis com regras de negócio e relacionamentos apropriados.</p>
    <p align="center">

# Sistema de Gerenciamento de Biblioteca

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Relacionamentos entre Entidades](#relacionamentos-entre-entidades)
- [Instalação](#instalação)
- [Executando a Aplicação](#executando-a-aplicação)
- [Documentação da API](#documentação-da-api)
- [Regras de Negócio](#regras-de-negócio)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Funcionalidades

- Operações CRUD completas para Livros, Autores, Locatários e Aluguéis
- Capacidades de busca:
  - Listar livros disponíveis para aluguel
  - Listar livros atualmente alugados
  - Buscar livros por ID
  - Buscar autores por nome
  - Listar todos os livros alugados por um locatário específico
- Aplicação de regras de negócio para exclusões:
  - Livros só podem ser excluídos se não foram alugados
  - Autores só podem ser excluídos se não possuem livros associados
  - Locatários só podem ser excluídos se não possuem livros pendentes para devolução

## Tecnologias

- **Framework Backend**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM/Query Builder**: Knex.js
- **Validação**: class-validator, class-transformer
- **Documentação da API**: Postman, Swagger (em breve)
- **Testes**: Jest
- **Qualidade de Código**: ESLint, Prettier

## Relacionamentos entre Entidades

- **Autor**: Pode ter 0 ou mais livros
- **Livro**: Deve ter 1 ou mais autores
- **Aluguel**: Deve conter pelo menos 1 livro e exatamente 1 locatário
- **Locatário**: Pode ter 0 ou mais aluguéis

## Instalação

### Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/joaoespdev/biblioteca-nest.git
cd biblioteca
```

2. Instale as dependências:

```bash
npm install
```

```bash
# Instale o software Docker Desktop, e abra a partir do passo 4
https://docs.docker.com/desktop/
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Configuração do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=biblioteca_db

DB_PORT_TEST=5432
DB_NAME_TEST=crud_biblioteca_test
```

4. Suba o banco de dados com Docker Compose:

```bash
# Use o comando
docker-compose up -d

# Execute as migrations de Desenvolvimento
npx knex migrate:latest --env development

# Execute as migrations de Teste
npx knex migrate:latest --env test
```

## Executando a Aplicação

```bash
# Rode os containers do banco que irá utilizar no Docker Desktop
```

```bash
# Modo de desenvolvimento
npm run start:dev
```

## Documentação da API

A documentação completa da API está disponível via Swagger UI. Após iniciar a aplicação, acesse:

```
http://localhost:3000/api
```

Esta documentação interativa permite:

- Explorar todos os endpoints disponíveis
- Visualizar esquemas de requisição/resposta
- Testar endpoints diretamente pelo navegador

## Regras de Negócio

### Livros

- Cada livro deve ter nome, ISBN e data de publicação
- Cada livro deve estar associado a pelo menos um autor
- Livros só podem ser excluídos se nunca foram alugados

### Autores

- Cada autor deve ter nome, ano de nascimento e CPF
- CPF deve ser único
- Autores só podem ser excluídos se não possuem livros associados

### Locatários

- Cada locatário deve ter nome, telefone, email, data de nascimento e CPF
- Email e CPF devem ser únicos
- Locatários só podem ser excluídos se não possuem livros pendentes para devolução

### Aluguéis

- Cada aluguel deve incluir pelo menos um livro e exatamente um locatário
- Por padrão, a data de devolução é definida para 2 dias após a data do aluguel
- O sistema não cobra taxas ou multas por atrasos na devolução

## Testes

O projeto inclui testes unitários abrangentes usando Jest.

```bash
# Executar testes
npm run test
```

## Estrutura do Projeto

```
📁 BIBLIOTECA-NEST
├── dist/                  # Arquivos compilados
├── migrations/            # Migrations do banco de dados
├── node_modules/
├── src/
│   ├── author/            # Módulo de autores
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── author.controller(.spec).ts
│   │   ├── author.module.ts
│   │   └── author.service(.spec).ts
│   ├── book/              # Módulo de livros
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── book.controller(.spec).ts
│   │   ├── book.module.ts
│   │   └── book.service(.spec).ts
│   ├── rental/            # Módulo de empréstimos
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── rental.controller(.spec).ts
│   │   ├── rental.module.ts
│   │   └── rental.service(.spec).ts
│   ├── renter/            # Módulo de locatários
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── renter.controller(.spec).ts
│   │   ├── renter.module.ts
│   │   └── renter.service(.spec).ts
│   ├── common/dto/        # DTOs compartilhados
│   ├── database/          # Serviço do Knex
│   ├── Enums/             # Enums utilizados
│   ├── interfaces/        # Interfaces de relacionamento
│   ├── app.controller(.spec).ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/app.e2e-spec.ts
├── docker-compose.yml
├── knexfile.ts
├── tsconfig*.json
├── jest.config.ts
├── eslint.config.mjs
├── .gitignore, .prettierrc
├── README.md
└── package*.json
```
