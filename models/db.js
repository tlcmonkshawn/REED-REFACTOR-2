const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'reed_refactor_2',
  user: 'reed_user',
  password: 'reed_password',
});

module.exports = pool;
