import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mvp_saude_homem',
    password: 'sua_senha_aqui',
    port: 5432,
});

export default pool;