# E-commerce Hub - Backend

Este projeto é o backend da aplicação de e-commerce desenvolvida como parte do teste técnico da Devnology. Ele é responsável por gerenciar usuários, carrinho de compras, pedidos e a integração com APIs de fornecedores nacionais e europeus.

## Tecnologias utilizadas

- Node.js com NestJS
- Prisma ORM
- SQLite (persistência simples para fins de teste)
- JWT para autenticação
- Axios para integração externa
- Jest + Supertest para testes automatizados

## Funcionalidades implementadas

- Registro e login de usuários
- Integração com dois fornecedores externos de produtos
- Listagem e detalhamento de produtos
- Carrinho de compras por usuário autenticado
- Finalização de pedidos com persistência
- Testes de integração

## Como executar o projeto

### Instalar as dependências

```bash
yarn
```

### Executar as migrações e gerar o client Prisma

```bash
npx prisma migrate dev --name init
```

### Iniciar o servidor de desenvolvimento

```bash
yarn start:dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Executando os testes

```bash
yarn test
```

## Decisões técnicas

- O NestJS foi escolhido pela sua estrutura organizada e escalável, ideal para desenvolvimento backend com responsabilidade bem distribuída.
- Prisma permite trabalhar com modelos relacionais de forma intuitiva e produtiva.
- SQLite foi adotado para persistência local, garantindo simplicidade na execução e entrega.
- JWT foi usado para garantir segurança e autenticação nas rotas sensíveis.
- Toda a lógica de negócios do carrinho e pedidos está protegida por autenticação, garantindo que cada usuário gerencie apenas seus próprios dados.

## Organização

- `/auth`: registro, login e geração de tokens
- `/products`: integração com APIs externas e listagem de produtos
- `/cart`: gestão de itens no carrinho
- `/orders`: finalização e persistência de pedidos