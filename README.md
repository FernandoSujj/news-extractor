# News Extractor

Aplicação web para extrair informações estruturadas de notícias usando IA (Google Gemini). Cole a URL de qualquer notícia e receba título, resumo, imagem e tags automaticamente.

## Estrutura do Projeto

```
extrator-de-noticias/
├── backend/
│   ├── server.js              # Servidor Express (API + serving do frontend)
│   ├── noteExtractor.js       # Lógica de extração com Gemini AI
│   ├── noteExtractor.test.js  # Testes
│   └── package.json           # Dependências Node.js
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Componente principal
│   │   ├── components/
│   │   │   ├── SearchBar.tsx  # Input de URL
│   │   │   ├── NewsCard.tsx   # Card de notícia
│   │   │   └── NewsList.tsx   # Lista de notícias
│   │   ├── types/
│   │   │   └── news.ts        # Tipos TypeScript
│   │   ├── App.css            # Estilos
│   │   └── index.css          # Estilos globais
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## Como Funciona

1. **Frontend** — O usuário insere a URL de uma notícia
2. **Backend** — Recebe a URL e faz fetch do HTML da página
3. **Backend** — Envia o HTML para a IA (Gemini) com um prompt de extração
4. **IA** — Processa o HTML e retorna dados estruturados (título, resumo, imagem, tags)
5. **Backend** — Retorna o JSON estruturado para o frontend
6. **Frontend** — Exibe a notícia processada em um card na lista

## Pré-requisitos

- Node.js 18+
- Chave de API do Google Gemini (`GOOGLE_API_KEY`)

## Configuração

### 1. Configurar variável de ambiente

Crie um arquivo `.env` na pasta `backend/`:

```bash
GOOGLE_API_KEY=sua_chave_aqui
```

### 2. Instalar dependências do backend

```bash
cd backend
npm install
```

### 3. Instalar dependências do frontend

```bash
cd frontend
npm install
```

## Executando

### Modo Desenvolvimento

Rode o backend e o frontend em terminais separados:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (dev server com hot reload):**
```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:5173/` com proxy automático para o backend na porta 5000.

### Modo Produção

Faça o build do frontend e sirva tudo pelo Express:

```bash
cd frontend
npm run build
cd ../backend
npm start
```

Acesse `http://localhost:5000/`

## Testes

```bash
cd backend
npm test
```

## API

### `POST /extract`

Extrai informações de uma notícia a partir da URL.

**Request:**
```json
{
  "url": "https://exemplo.com/noticia"
}
```

**Response (sucesso):**
```json
{
  "result": {
    "titulo": "Título da notícia",
    "resumo": "Resumo do conteúdo...",
    "imagem_principal": "https://exemplo.com/imagem.jpg",
    "tags": ["tag1", "tag2", "tag3"]
  }
}
```

**Response (erro):**
```json
{
  "result": {
    "status_code": 400,
    "Erro": "Descrição do erro"
  }
}
```

### `GET /image-proxy?url=<url>`

Proxy para carregar imagens externas evitando bloqueios de CORS.

## Tecnologias

- **Backend:** Node.js, Express, Google Generative AI (Gemini)
- **Frontend:** React, TypeScript, Vite
- **IA:** Google Gemini 2.5 Flash Lite
