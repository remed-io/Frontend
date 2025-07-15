# Dockerfile para build e deploy do frontend

# Fase de build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependências
COPY package.json tsconfig.json ./
COPY vite.config.ts .
RUN npm install

# Copiar código e gerar build estático
COPY . .
RUN npm run build

# Fase de produção
FROM nginx:stable-alpine

# Remover configuração default e copiar nossa
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta 80 para servir conteúdo
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
