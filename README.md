# Fisio no Marketing — Landing Page

Landing page da comunidade **Fisio no Marketing** — plataforma de IA para fisioterapeutas.

## Stack

- **Framework:** Vite + React 18
- **Estilo:** TailwindCSS + CSS-in-JS inline
- **Deploy:** Docker (nginx) via Portainer no VPS

---

## Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env
# Edite .env e coloque o link real do WhatsApp

# 3. Rodar em dev
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## Build de produção

```bash
npm run build
# Gera a pasta /dist pronta para deploy
```

---

## Deploy no VPS com Portainer

### Opção 1 — Via Portainer Stacks (recomendado)

1. No Portainer, vá em **Stacks → Add Stack**
2. Escolha **Upload** e suba o `docker-compose.yml`
3. Em **Environment variables**, adicione:
   - `VITE_WHATSAPP_LINK` = seu link do grupo
4. Clique em **Deploy the stack**

### Opção 2 — Via terminal no VPS

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SEU_REPO

# Configure o .env
cp .env.example .env
nano .env   # Preencha VITE_WHATSAPP_LINK

# Build e sobe o container
docker compose up -d --build
```

A aplicação ficará disponível na porta **3010** do VPS.  
Configure seu reverse proxy (nginx/Traefik) para apontar o domínio para essa porta.

---

## Antes do go-live — checklist

- [ ] Coloque o favicon real em `/public/favicon.png`
- [ ] Crie a imagem OG em `/public/og-image.jpg` (1200×630px)
- [ ] Atualize `seudominio.com.br` no `index.html` com a URL real
- [ ] Preencha `VITE_WHATSAPP_LINK` no `.env` do servidor
- [ ] Ative o Google Analytics: descomente o bloco no `index.html` e insira o Measurement ID
- [ ] Ative o Meta Pixel: descomente o bloco no `index.html` e insira o Pixel ID

---

## Estrutura do projeto

```
├── landing-page.jsx      # Componente principal (não edite sem motivo)
├── src/
│   ├── main.jsx          # Entry point React
│   └── index.css         # Tailwind directives + base styles
├── public/
│   └── favicon.png       # Coloque seu favicon aqui
├── index.html            # HTML com meta tags, OG, analytics placeholders
├── Dockerfile            # Build multi-stage (Node → nginx)
├── docker-compose.yml    # Para Portainer / docker compose
├── nginx.conf            # Configuração nginx
├── .env.example          # Template de variáveis de ambiente
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```
