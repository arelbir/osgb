import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const sslOption = process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {};

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'osgb',
  synchronize: false,
  logging: false,
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  ...sslOption,
});
