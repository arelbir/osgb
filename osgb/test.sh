#!/bin/bash

# Bu script, OSGB yönetim sistemi uygulamasını test etmek için kullanılır

# Renk tanımlamaları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}OSGB Yönetim Sistemi Test Ediliyor...${NC}"

# Backend klasörüne git
cd /home/ubuntu/osgb-clone/backend

# Backend bağımlılıklarını kontrol et
echo -e "${YELLOW}Backend bağımlılıkları kontrol ediliyor...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Backend bağımlılıkları kuruluyor...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}Backend bağımlılıkları kurulurken hata oluştu.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Backend bağımlılıkları başarıyla kuruldu.${NC}"
else
  echo -e "${GREEN}Backend bağımlılıkları zaten kurulu.${NC}"
fi

# PostgreSQL veritabanı bağlantısını kontrol et
echo -e "${YELLOW}PostgreSQL bağlantısı kontrol ediliyor...${NC}"
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

# Veritabanı şemasını oluştur
echo -e "${YELLOW}Veritabanı şeması oluşturuluyor...${NC}"
if node -e "
const { AppDataSource } = require('./dist/config/database');
require('dotenv').config();

AppDataSource.initialize()
  .then(() => {
    console.log('Veritabanı şeması başarıyla oluşturuldu');
    process.exit(0);
  })
  .catch(err => {
    console.error('Veritabanı şeması oluşturulurken hata:', err);
    process.exit(1);
  });
"; then
  echo -e "${GREEN}Veritabanı şeması başarıyla oluşturuldu${NC}"
else
  echo -e "${RED}Veritabanı şeması oluşturulurken hata oluştu.${NC}"
  exit 1
fi

# Test kullanıcısı oluştur
echo -e "${YELLOW}Test kullanıcısı oluşturuluyor...${NC}"
if node -e "
const { AppDataSource } = require('./dist/config/database');
const { User } = require('./dist/models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

AppDataSource.initialize()
  .then(async () => {
    const userRepository = AppDataSource.getRepository(User);
    
    // Kullanıcı var mı kontrol et
    const existingUser = await userRepository.findOne({ where: { username: 'admin' } });
    
    if (existingUser) {
      console.log('Test kullanıcısı zaten mevcut');
      process.exit(0);
    }
    
    // Yeni kullanıcı oluştur
    const user = new User();
    user.username = 'admin';
    user.password = await bcrypt.hash('admin123', 10);
    user.full_name = 'Admin User';
    user.email = 'admin@example.com';
    user.role = 'admin';
    user.is_active = true;
    
    await userRepository.save(user);
    console.log('Test kullanıcısı başarıyla oluşturuldu');
    process.exit(0);
  })
  .catch(err => {
    console.error('Test kullanıcısı oluşturulurken hata:', err);
    process.exit(1);
  });
"; then
  echo -e "${GREEN}Test kullanıcısı başarıyla oluşturuldu${NC}"
else
  echo -e "${RED}Test kullanıcısı oluşturulurken hata oluştu.${NC}"
  exit 1
fi

# Frontend klasörüne git
cd /home/ubuntu/osgb-clone/frontend

# Frontend bağımlılıklarını kontrol et
echo -e "${YELLOW}Frontend bağımlılıkları kontrol ediliyor...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Frontend bağımlılıkları kuruluyor...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}Frontend bağımlılıkları kurulurken hata oluştu.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Frontend bağımlılıkları başarıyla kuruldu.${NC}"
else
  echo -e "${GREEN}Frontend bağımlılıkları zaten kurulu.${NC}"
fi

# .env.local dosyasını kontrol et
echo -e "${YELLOW}.env.local dosyası kontrol ediliyor...${NC}"
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}.env.local dosyası oluşturuluyor...${NC}"
  echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
  echo -e "${GREEN}.env.local dosyası başarıyla oluşturuldu.${NC}"
else
  echo -e "${GREEN}.env.local dosyası zaten mevcut.${NC}"
fi

echo -e "${GREEN}Tüm testler başarıyla tamamlandı.${NC}"
echo -e "${YELLOW}Uygulamayı başlatmak için: ${GREEN}./start.sh${NC}"
echo -e "${YELLOW}Giriş bilgileri:${NC}"
echo -e "${YELLOW}Kullanıcı adı: ${GREEN}admin${NC}"
echo -e "${YELLOW}Şifre: ${GREEN}admin123${NC}"
