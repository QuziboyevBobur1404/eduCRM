## ============================================================
## FILE 1: backend/Dockerfile
## ============================================================

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p uploads
EXPOSE 3001
CMD ["node", "dist/main"]

## ============================================================
## FILE 2: frontend/Dockerfile
## ============================================================

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

## ============================================================
## FILE 3: docker-compose.yml (root)
## ============================================================

version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: educrm_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME:-educrm_db}
      POSTGRES_USER: ${DB_USER:-educrm_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-educrm_user}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - educrm_network

  redis:
    image: redis:7-alpine
    container_name: educrm_redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
    networks:
      - educrm_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: educrm_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 15m
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      JWT_REFRESH_EXPIRES_IN: 7d
      FRONTEND_URL: https://${DOMAIN}
    volumes:
      - uploads_data:/app/uploads
    networks:
      - educrm_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: educrm_frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: https://api.${DOMAIN}
      NEXT_PUBLIC_WS_URL: wss://api.${DOMAIN}
    networks:
      - educrm_network

  nginx:
    image: nginx:alpine
    container_name: educrm_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - backend
      - frontend
    networks:
      - educrm_network

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot -w /var/www/certbot --email ${ADMIN_EMAIL} -d ${DOMAIN} -d api.${DOMAIN} --agree-tos --no-eff-email

volumes:
  postgres_data:
  redis_data:
  uploads_data:

networks:
  educrm_network:
    driver: bridge

## ============================================================
## FILE 4: nginx/nginx.conf
## ============================================================

worker_processes auto;
events { worker_connections 1024; }

http {
  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # Gzip
  gzip on;
  gzip_types text/plain application/json application/javascript text/css;

  # Rate limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=20r/s;

  # API server
  upstream backend {
    server backend:3001;
    keepalive 32;
  }

  # Frontend server
  upstream frontend {
    server frontend:3000;
    keepalive 16;
  }

  # Redirect HTTP → HTTPS
  server {
    listen 80;
    server_name _;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
  }

  # API subdomain
  server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # REST API
    location /api {
      limit_req zone=api burst=30 nodelay;
      proxy_pass http://backend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      client_max_body_size 10M;
    }

    # WebSocket
    location /ws {
      proxy_pass http://backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_read_timeout 86400;
    }

    # Static uploads
    location /uploads {
      proxy_pass http://backend;
      expires 30d;
      add_header Cache-Control "public, immutable";
    }
  }

  # App subdomain
  server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
      proxy_pass http://frontend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}

## ============================================================
## FILE 5: .env (production template)
## ============================================================

# Domain
DOMAIN=yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Database
DB_NAME=educrm_db
DB_USER=educrm_user
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD

# Redis
REDIS_PASSWORD=CHANGE_ME_REDIS_PASSWORD

# JWT (generate with: openssl rand -hex 32)
JWT_SECRET=CHANGE_ME_32_CHAR_SECRET
JWT_REFRESH_SECRET=CHANGE_ME_32_CHAR_REFRESH_SECRET
