const { Pool } = require('pg');

const pool = new Pool({
    user: 'chirag',
    host: 'localhost',
    database: 'phr',
    password: 'chirag',
    port: 5432, // default PostgreSQL port
});
const client = pool.connect()
try {
    const res = client.query('SELECT $1::text as message', ['Hello world!']);
    console.log(res.rows[0].message); // Hello world!
}
catch (err) {
    console.log(err.stack);
}
// Don't forget to close the pool when you're done with it
pool.end();
