const { Pool } = require('pg');

const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'crawlertestdb',
  password: 'docker',
  port: 5432,
});

module.exports = { pool };