# ═══════════════════════════════════════
# STAGE 1 — Build
# ═══════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build args para variáveis de ambiente Vite
ARG VITE_WHATSAPP_LINK
ARG VITE_SITE_URL
ENV VITE_WHATSAPP_LINK=$VITE_WHATSAPP_LINK
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN npm run build

# ═══════════════════════════════════════
# STAGE 2 — Serve com nginx
# ═══════════════════════════════════════
FROM nginx:alpine

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build gerado pelo Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
