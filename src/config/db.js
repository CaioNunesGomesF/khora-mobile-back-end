import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

export default pool;
