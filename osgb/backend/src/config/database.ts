import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_dPi9OjWnD3rZ@ep-divine-sunset-a2uifrst-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  ssl: true
});
