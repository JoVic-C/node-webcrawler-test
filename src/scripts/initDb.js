const { Pool } = require('pg');

const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'crawlertestdb',
  password: 'docker',
  port: 5432,
});

const createTables = async () => {
  const queries = `
    CREATE TABLE IF NOT EXISTS portal (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      observacoes TEXT
    );

    CREATE TABLE IF NOT EXISTS captura (
      id SERIAL PRIMARY KEY,
      portal_id INT REFERENCES portal(id),
      filtros JSONB,
      status VARCHAR(50),
      data_hora_inicio TIMESTAMP,
      data_hora_fim TIMESTAMP
    );
  `;

  try {
    await pool.query(queries);
    console.log('Tabelas criadas.');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  } finally {
    pool.end();
  }
};

const checkDatabase = async () => {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('Tabelas existentes no banco de dados:', res.rows);
  } catch (err) {
    console.error('Erro ao verificar tabelas:', err);
  } finally {
    pool.end();
  }
};


createTables();
//checkDatabase();
