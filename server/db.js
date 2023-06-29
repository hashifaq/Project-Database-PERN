// const Pool = require("pg").Pool;
const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "shifa123",
    host: "localhost",
    port: 5433,
    database: "postgres"
  });
  
  module.exports = pool;
  