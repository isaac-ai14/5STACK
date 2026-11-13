# 5STACK

O **5STACK** é um projeto desenvolvido para facilitar a conexão entre jogadores de Valorant, ajudando a encontrar pessoas e formar grupos com interesses e características compatíveis.

A proposta é tornar mais fácil encontrar jogadores considerando critérios como patente, função e estilo de jogo.

## Tecnologias utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript

### Back-end
- Node.js
- Express
- PostgreSQL
- `pg` para conexão com o banco de dados
- `bcrypt` para criptografia de senhas

## Estrutura do projeto

```text
5STACK/
├── backend/
│   └── src/
│       ├── app.js
│       ├── db.js
│       └── routes/
│           └── usuarios.js
├── database/
│   └── 01_estrutura_5stack_pg.sql
├── frontend/
│   ├── imagens/
│   ├── 5StackPrincipal.html
│   ├── 5StackContato.html
│   ├── 5StackQuemSomos.html
│   ├── 5StackAdmin.html
│   ├── 5stack.css
│   ├── 5stack.js
│   └── admin.js
├── package.json
└── README.md
```

## Funcionalidades implementadas

- **Página principal:** apresentação dos jogadores e funcionalidades de interação.
- **Cadastro e gerenciamento de jogadores:** operações de cadastro, edição, exclusão e listagem na página principal, utilizando `localStorage`.
- **Painel administrativo:** gerenciamento de usuários integrado à API REST.
- **Página de contato:** formulário com validação em JavaScript.
- **Página Quem Somos:** apresentação do projeto e da equipe.
- **API REST:** permite cadastrar, consultar, atualizar e excluir usuários.
- **Banco de dados:** estrutura em PostgreSQL para armazenar os dados do sistema.

## API REST

A API foi desenvolvida utilizando Node.js e Express, com integração ao PostgreSQL.

A aplicação utiliza a porta `3000` e disponibiliza as seguintes rotas:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/:id` | Consulta um usuário pelo ID |
| POST | `/usuarios` | Cadastra um novo usuário |
| PUT | `/usuarios/:id` | Atualiza os dados de um usuário |
| DELETE | `/usuarios/:id` | Exclui um usuário |

O painel administrativo utiliza `fetch()` e `async/await` para realizar as requisições à API.

## Como executar o projeto

### 1. Pré-requisitos

- Node.js instalado.
- PostgreSQL instalado e configurado.
- Visual Studio Code ou outro editor de código.
- Extensão Live Server para executar o front-end.

### 2. Clonar o repositório

```bash
git clone https://github.com/isaac-ai14/5STACK.git
```

Entre na pasta do projeto:

```bash
cd 5STACK
```

### 3. Instalar as dependências

Na pasta principal do projeto, execute:

```bash
npm install
```

### 4. Configurar o banco de dados

Crie um banco de dados PostgreSQL com o nome `5stack`.

Em seguida, execute o arquivo SQL:

```text
database/01_estrutura_5stack_pg.sql
```

Esse arquivo contém a estrutura das tabelas utilizadas pelo sistema.

### 5. Configurar as variáveis de ambiente

Na raiz do projeto, crie um arquivo chamado `.env` e configure os dados de conexão com o PostgreSQL:

```env
DB_HOST=localhost
DB_NAME=5stack
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
```

Substitua os valores conforme a configuração do seu PostgreSQL.

**Importante:** não compartilhe nem envie o arquivo `.env` para o GitHub, pois ele contém informações privadas de acesso ao banco de dados.

### 6. Iniciar o back-end

Na pasta principal do projeto, execute:

```bash
node backend/src/app.js
```

A API ficará disponível em:

```text
http://localhost:3000
```

### 7. Executar o front-end

Abra a pasta do projeto no Visual Studio Code e utilize o Live Server para executar os arquivos HTML da pasta `frontend`.

Para testar a integração com a API, abra:

```text
frontend/5StackAdmin.html
```

O Live Server deve utilizar o endereço `http://127.0.0.1:5500`, conforme a configuração de CORS do back-end.

## Banco de dados

O projeto utiliza PostgreSQL para armazenar informações relacionadas aos usuários e à estrutura do sistema.

O script de criação do banco contém tabelas relacionadas a:

- Usuários;
- Patentes;
- Funções;
- Relação entre usuários e funções;
- Lobbies;
- Membros dos lobbies;
- Convites.

## Equipe de desenvolvimento

Projeto acadêmico desenvolvido como parte do curso de Análise e Desenvolvimento de Sistemas.

**Repositório:** [GitHub - 5STACK](https://github.com/isaac-ai14/5STACK)