#!/bin/bash

# Bu script, OSGB yönetim sistemi uygulamasını dağıtmak için kullanılır

# Renk tanımlamaları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}OSGB Yönetim Sistemi Dağıtım Hazırlığı...${NC}"

# Backend klasörüne git
cd /home/ubuntu/osgb-clone/backend

# Backend için production build oluştur
echo -e "${YELLOW}Backend için production build oluşturuluyor...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Backend build işlemi sırasında hata oluştu.${NC}"
  exit 1
fi
echo -e "${GREEN}Backend build işlemi başarıyla tamamlandı.${NC}"

# Frontend klasörüne git
cd /home/ubuntu/osgb-clone/frontend

# Frontend için production build oluştur
echo -e "${YELLOW}Frontend için production build oluşturuluyor...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Frontend build işlemi sırasında hata oluştu.${NC}"
  exit 1
fi
echo -e "${GREEN}Frontend build işlemi başarıyla tamamlandı.${NC}"

# Ana klasöre dön
cd /home/ubuntu/osgb-clone

# Dağıtım için gerekli dosyaları hazırla
echo -e "${YELLOW}Dağıtım dosyaları hazırlanıyor...${NC}"

# Docker Compose dosyası oluştur
cat > docker-compose.yml << 'EOL'
version: '3'

services:
  postgres:
    image: postgres:14
    container_name: osgb-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-osgb}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - osgb-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: osgb-backend
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@postgres:5432/${POSTGRES_DB:-osgb}
      NODE_ENV: production
      PORT: 5000
      JWT_SECRET: ${JWT_SECRET:-your_jwt_secret}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - osgb-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: osgb-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - osgb-network

networks:
  osgb-network:
    driver: bridge

volumes:
  postgres_data:
EOL

# Backend için Dockerfile oluştur
cat > backend/Dockerfile << 'EOL'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY .env ./.env

EXPOSE 5000

CMD ["node", "dist/index.js"]
EOL

# Frontend için Dockerfile oluştur
cat > frontend/Dockerfile << 'EOL'
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOL

# Frontend için next.config.js dosyasını güncelle
cat > frontend/next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;
EOL

# .env dosyası oluştur
cat > .env << 'EOL'
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=osgb

# Backend
JWT_SECRET=your_jwt_secret_change_this_in_production
EOL

# Dağıtım talimatları dosyası oluştur
cat > DEPLOYMENT.md << 'EOL'
# OSGB Yönetim Sistemi Dağıtım Talimatları

Bu belge, OSGB Yönetim Sistemi'nin dağıtımı için gerekli adımları içerir.

## Gereksinimler

- Docker ve Docker Compose
- Git

## Dağıtım Adımları

1. Repoyu klonlayın:
   ```
   git clone <repo-url>
   cd osgb-clone
   ```

2. `.env` dosyasını düzenleyin:
   ```
   # PostgreSQL
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=güçlü_bir_şifre_belirleyin
   POSTGRES_DB=osgb

   # Backend
   JWT_SECRET=güçlü_bir_jwt_secret_belirleyin
   ```

3. Docker Compose ile uygulamayı başlatın:
   ```
   docker-compose up -d
   ```

4. Uygulamaya erişin:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

5. İlk giriş için varsayılan kullanıcı bilgileri:
   - Kullanıcı adı: admin
   - Şifre: admin123

   **Not:** Güvenlik için ilk girişten sonra admin şifresini değiştirmeniz önerilir.

## Bakım ve İzleme

- Logları görüntüleme:
  ```
  docker-compose logs -f
  ```

- Servisleri yeniden başlatma:
  ```
  docker-compose restart
  ```

- Uygulamayı durdurma:
  ```
  docker-compose down
  ```

## Yedekleme

PostgreSQL veritabanını yedeklemek için:

```
docker exec osgb-postgres pg_dump -U postgres osgb > backup.sql
```

## Güncelleme

Yeni bir sürüme güncelleme yapmak için:

1. Repoyu güncelleyin:
   ```
   git pull
   ```

2. Uygulamayı yeniden oluşturun ve başlatın:
   ```
   docker-compose down
   docker-compose up -d --build
   ```
EOL

echo -e "${GREEN}Dağıtım dosyaları başarıyla hazırlandı.${NC}"
echo -e "${YELLOW}Dağıtım talimatları için: ${GREEN}DEPLOYMENT.md${NC} dosyasını inceleyebilirsiniz."
echo -e "${YELLOW}Docker Compose ile dağıtım yapmak için: ${GREEN}docker-compose up -d${NC} komutunu kullanabilirsiniz."
