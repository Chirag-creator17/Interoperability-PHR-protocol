const { Pool } = require('pg');

const pool = new Pool({
    user: 'chirag',
    host: 'localhost',
    database: 'phr',
    password: 'chirag',
    port: 5432, // default PostgreSQL port
});