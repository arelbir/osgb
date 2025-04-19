#!/bin/bash

# Bu script, OSGB yönetim sistemi uygulamasını başlatmak için kullanılır

# Renk tanımlamaları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}OSGB Yönetim Sistemi Başlatılıyor...${NC}"

# PostgreSQL veritabanı bağlantısını kontrol et
echo -e "${YELLOW}PostgreSQL bağlantısı kontrol ediliyor...${NC}"
cd /home/ubuntu/osgb-clone/backend
if node -e "
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => {
    console.log('PostgreSQL bağlantısı başarılı');
    client.end();
    process.exit(0);
  })
  .catch(err => {
    console.error('PostgreSQL bağlantı hatası:', err);
    process.exit(1);
  });
"; then
  echo -e "${GREEN}PostgreSQL bağlantısı başarılı${NC}"
else
  echo -e "${RED}PostgreSQL bağlantısı başarısız. Lütfen .env dosyasındaki bağlantı bilgilerini kontrol edin.${NC}"
  exit 1
fi

# Backend uygulamasını başlat
echo -e "${YELLOW}Backend uygulaması başlatılıyor...${NC}"
cd /home/ubuntu/osgb-clone/backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend uygulaması başlatıldı (PID: $BACKEND_PID)${NC}"

# Backend'in başlaması için biraz bekle
echo -e "${YELLOW}Backend'in başlaması bekleniyor...${NC}"
sleep 5

# Backend'in çalışıp çalışmadığını kontrol et
if curl -s http://localhost:5000/health > /dev/null; then
  echo -e "${GREEN}Backend başarıyla çalışıyor${NC}"
else
  echo -e "${RED}Backend başlatılamadı. Lütfen logları kontrol edin.${NC}"
  kill $BACKEND_PID
  exit 1
fi

# Frontend uygulamasını başlat
echo -e "${YELLOW}Frontend uygulaması başlatılıyor...${NC}"
cd /home/ubuntu/osgb-clone/frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend uygulaması başlatıldı (PID: $FRONTEND_PID)${NC}"

# Frontend'in başlaması için biraz bekle
echo -e "${YELLOW}Frontend'in başlaması bekleniyor...${NC}"
sleep 10

echo -e "${GREEN}OSGB Yönetim Sistemi başarıyla başlatıldı${NC}"
echo -e "${YELLOW}Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "${YELLOW}Backend API: ${GREEN}http://localhost:5000/api${NC}"
echo -e "${YELLOW}Uygulamayı durdurmak için Ctrl+C tuşlarına basın${NC}"

# Uygulamaları durdurmak için trap tanımla
trap "echo -e '${YELLOW}Uygulama durduruluyor...${NC}'; kill $BACKEND_PID $FRONTEND_PID; echo -e '${GREEN}Uygulama durduruldu${NC}'; exit 0" INT

# Uygulamaların çalışmasını bekle
wait
