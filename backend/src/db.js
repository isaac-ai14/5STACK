import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

// Testar conexão com PostgreSQL
pool.query('SELECT NOW()')
  .then(() => console.log('PostgreSQL conectado com sucesso!'))
  .catch((err) => console.error('Erro ao conectar:', err.message));

export default pool;