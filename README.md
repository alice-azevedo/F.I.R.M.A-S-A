# YE VELAS AROMÁTICAS ✨🕯️

Backend da aplicação de velas aromáticas personalizadas, com gerenciamento de **usuários**, **produtos**, **personalizações** e **pedidos**.

[![Node.js](https://img.shields.io/badge/Node.js-v22-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.40.7-blueviolet)](https://supabase.com/)

---

## 🔧 Tecnologias

- **Node.js** + **TypeScript**
- **Express** (API REST)
- **Supabase** (PostgreSQL + Auth)
- **Nodemon** (desenvolvimento)
- **CORS** e middlewares personalizados
- Funções utilitárias (`calcTotal`) para pedidos

---

## 📂 Estrutura do Projeto

src/
├── app.ts # Configuração do Express
├── server.ts # Ponto de entrada
├── routes/ # Rotas da API
│ ├── products.ts
│ ├── personalizacoes.ts
│ └── pedidos.ts
├── controllers/ # Lógica dos endpoints
├── services/ # Conexão com Supabase
└── utils/ # Funções utilitárias (calcTotal.ts)


---

## Instalação Rápida

1. Clonar repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd "YE VELAS COM AFETO/Backend"

    Instalar dependências:

npm install

    Configurar variáveis de ambiente (.env):

SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
PORT=3000

## Rodando em Desenvolvimento

npm run dev

    Monitora alterações com nodemon + ts-node.

    Servidor em http://localhost:3000.

## Endpoints
### Produtos

    GET /products → Listar todos os produtos

    GET /products/:id → Buscar produto por ID

### Personalizações

    GET /personalizacoes → Listar personalizações do usuário

    POST /personalizacoes → Criar nova personalização

### Pedidos

    GET /pedidos → Listar pedidos do usuário

    POST /pedidos → Criar pedido (total calculado automaticamente)

    GET /pedidos/:id/total → Retorna valor total do pedido com detalhes dos itens

## Observações

    Autenticação baseada em Supabase Auth.

    Sistema de pagamentos pode ser integrado (Stripe / Mercado Pago).

    Todos os endpoints requerem autenticação, exceto /products.

    calcTotal.ts calcula automaticamente o valor de cada pedido.

## Scripts Úteis

"scripts": {
  "dev": "nodemon",
  "build": "tsc",
  "start": "node dist/server.js"
}

    npm run dev → Desenvolvimento

    npm run build → Compila TypeScript

    npm start → Rodar backend compilado

## Contribuição

    Fork do repositório

    Criar branch: git checkout -b feature/nova-funcionalidade

    Commit: git commit -m "Descrição da feature"

    Push: git push origin feature/nova-funcionalidade

    Abrir Pull Request

## Licença

MIT License © 2025