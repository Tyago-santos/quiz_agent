# Quiz AI — Plataforma de Perguntas com Inteligência Artificial

Aplicação full-stack que utiliza **Google Gemini** via **LangGraph** para classificar e responder perguntas escolares como um professor especialista. O usuário faz uma pergunta, a IA classifica a matéria (matemática, português, história ou geografia) e responde no papel de um professor daquela disciplina.

---

## Stack

### Backend (`/backend`)

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Python** | 3.12 | Linguagem |
| **FastAPI** | 0.115 | Framework web |
| **Uvicorn** | 0.34 | Servidor ASGI |
| **LangChain** | 0.3 | Orquestração de LLM |
| **LangGraph** | 0.2 | State machine do agente |
| **Gemini (Google)** | 2.5-flash | Modelo de IA |
| **SQLAlchemy** | 2.0 | ORM |
| **PostgreSQL** | 15 | Banco de dados |
| **python-jose** | 3.3 | JWT |
| **passlib + bcrypt** | — | Hash de senhas |

### Frontend (`/frontend`)

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Next.js** | 16.2 | Framework React |
| **React** | 19.2 | UI |
| **TypeScript** | 5 | Tipagem |
| **Tailwind CSS** | 4 | Estilização |
| **React Hook Form** | 7.76 | Formulários |
| **Zod** | 4 | Validação de schemas |
| **Vitest** | 4 | Testes unitários |
| **Testing Library** | — | Testes de componentes |

### Infraestrutura

| Tecnologia | Finalidade |
|---|---|
| **Docker Compose** | Orquestração local |
| **Render** | Deploy em produção (Blueprint) |

---

## Funcionalidades

- **Autenticação JWT** — registro e login com email + senha
- **Agente Inteligente** — classifica perguntas em 4 matérias e responde como professor especialista
- **Proteção de rotas** — middleware Next.js redireciona não autenticados
- **Histórico** — perguntas e respostas persistidas no PostgreSQL
- **Tratamento de erros** — mensagens amigáveis para limite de cota (429) e indisponibilidade (503)
- **Modo dev/prod** — entrypoint detecta ambiente e ajusta hot-reload
- **Testes** — Vitest + Testing Library para componentes e serviços

---

## Estrutura do Projeto

```
quiz/
├── backend/                          # API Python
│   ├── agent/
│   │   └── langchain.py              # State machine do agente (LangGraph)
│   ├── repository/
│   │   ├── quiz_repository.py        # Acesso a dados do quiz
│   │   └── user_repository.py        # Acesso a dados de usuário
│   ├── routers/
│   │   ├── auth.py                   # POST /auth/register, /auth/login
│   │   └── quiz.py                   # POST /quiz/ask (protegido)
│   ├── schemas/
│   │   ├── auth.py                   # Pydantic: LoginRequest, TokenResponse
│   │   └── quiz.py                   # Pydantic: QuestionRequest, QuestionResponse
│   ├── services/
│   │   ├── auth_service.py           # JWT, hash, login, registro
│   │   └── quiz_service.py           # Orquestração do agente
│   ├── database.py                   # SQLAlchemy engine + session
│   ├── main.py                       # FastAPI app + lifespan + CORS
│   ├── models.py                     # ORM: User, QuizHistory
│   ├── entrypoint.sh                 # Dev (--reload) / Prod
│   └── Dockerfile
│
├── frontend/                         # App Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx    # Página de login
│   │   │   │   └── register/page.tsx # Página de cadastro
│   │   │   ├── (private)/
│   │   │   │   └── (home)/page.tsx   # Página principal (protegida)
│   │   │   ├── layout.tsx            # Layout global
│   │   │   └── globals.css           # Estilos globais + Tailwind
│   │   ├── components/
│   │   │   ├── HomeComponent.tsx     # Componente de perguntas
│   │   │   ├── LoginComponent.tsx    # Formulário de login
│   │   │   └── RegisterComponent.tsx # Formulário de cadastro
│   │   ├── services/                 # Chamadas à API
│   │   │   ├── quizService.ts        # POST /quiz/ask
│   │   │   ├── loginService.ts       # POST /auth/login
│   │   │   └── registerService.ts    # POST /auth/register
│   │   ├── schema/                   # Validação Zod
│   │   ├── middleware.ts             # Rotas protegidas via cookie + token
│   │   └── __test__/                 # Testes unitários e de integração
│   ├── vitest.config.ts
│   └── Dockerfile                    # Multi-stage (dev / prod)
│
├── compose.yaml                      # Docker Compose (3 serviços)
├── render.yaml                       # Blueprint Render (deploy)
└── .env                              # Variáveis de ambiente
```

---

## Arquitetura

```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐     ┌─────────┐
│  Browser  │────▶│  Next.js 16  │────▶│  FastAPI + Agent  │────▶│ Gemini  │
│ (React)   │     │  (SSR/CSR)   │     │  (LangGraph)      │     │   AI    │
└──────────┘     └──────────────┘     └──────────┬───────┘     └─────────┘
                         ▲                        │
                         │                        ▼
                         │              ┌──────────────────┐
                         │              │   PostgreSQL 15   │
                         │              │  (via SQLAlchemy) │
                         │              └──────────────────┘
                    JWT Auth (Bearer)
```

### Frontend

- **Next.js App Router** com rotas de grupo `(auth)` e `(private)`
- **Middleware** verifica cookie `token` e redireciona conforme autenticação
- **Components** desacoplados da lógica de API — recebem `onSubmit`/`onAsk` via props
- **Services** centralizam chamadas HTTP com fetch nativo
- **Zod** valida formulários no cliente antes de enviar

### Backend

- **MCV (Model-Controller-View)** com camadas bem definidas:
  - **Routers** → só roteamento e validação (FastAPI + Pydantic)
  - **Services** → lógica de negócio e orquestração
  - **Repository** → acesso a dados (SQLAlchemy)
  - **Schemas** → contratos de entrada/saída
- **Lifespan** do FastAPI cria tabelas automaticamente no startup
- **Agente LangGraph** é uma state machine que:
  1. `classify` → classifica a pergunta em uma matéria
  2. `router` → direciona para o nó especialista
  3. `matematica|portugues|historia|geografia` → responde como professor daquela matéria
- **JWT** com bcrypt para hash de senhas e tokens com expiração de 24h

---

## Como Rodar

### Pré-requisitos

- Docker + Docker Compose
- Uma chave da [Google Gemini API](https://aistudio.google.com/apikey)

### 1. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_aqui
POSTGRES_USER=user_quiz
POSTGRES_PASSWORD=123456
POSTGRES_DB=quiz_db
DATABASE_URL=postgresql://user_quiz:123456@database:5432/quiz_db
```

### 2. Suba os containers

```bash
docker compose up --build
```

Isso sobe 3 serviços:

| Serviço | Acesso |
|---|---|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:8000 |
| Banco (PostgreSQL) | localhost:5432 |
| Docs Swagger | http://localhost:8000/docs |

### 3. Use a aplicação

1. Acesse http://localhost:3000/register e crie uma conta
2. Faça login
3. Faça perguntas como:
   - *"Quanto é 2+2?"* → professor de matemática
   - *"Quem foi Pelé?"* → professor de história
   - *"O que é sujeito e predicado?"* → professor de português
   - *"Qual a capital da França?"* → professor de geografia

---

## API

### `POST /auth/register`

```json
{ "username": "joao", "email": "joao@email.com", "password": "123456" }
```

### `POST /auth/login`

```json
{ "email": "joao@email.com", "password": "123456" }
// → { "access_token": "eyJ...", "token_type": "bearer" }
```

### `POST /quiz/ask` (protegida — requer `Authorization: Bearer <token>`)

```json
{ "message": "quem foi pelé?" }
// → { "response": "...", "lesson": "historia" }
```

---

## Deploy no Render

O projeto inclui um `render.yaml` (Render Blueprint). Basta conectar o repositório no Render que ele:

1. Cria o banco PostgreSQL
2. Faz o build e deploy do backend via Docker
3. Injeta as env vars automaticamente (`DATABASE_URL`, `SECRET_KEY`)

Configure manualmente no dashboard do Render:

- `GEMINI_API_KEY` — sua chave da Google Gemini

---

## Testes

```bash
# Backend — via pytest
cd backend && pytest

# Frontend — via Vitest
cd frontend && npm test
# ou com interface gráfica
cd frontend && npm run test:ui
```

---

## Licença

Projeto de portfólio — código livre para estudo e referência.
