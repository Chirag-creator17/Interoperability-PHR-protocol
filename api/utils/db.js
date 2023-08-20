const { Pool } = require("pg");

const getDBPool = (concurrencyCount = 1) => {
  return new Pool({
    max: concurrencyCount, // pool size
    user: "postgres",
    host: "localhost",
    database: "phr",
    password: "postgres",
    port: 5432,
  });
};

const insertUser = async (id, name, profileType, publicKey,secretKey, phone ) => {
    let pool, client;
    try{
        pool = getDBPool(1)
        client = await pool.connect()

        const query = `INSERT INTO users(id, name, profile_type, public_key, secret_key, phone) VALUES($1,$2,$3,$4,$5,$6);`;
        const res = await client.query(query, [id, name,profileType ,publicKey, secretKey, phone])
        return {status: 201, msg: "success"}
    } catch(err){
        return {status: 400, msg: `error in fetch user ${err}`}
    } finally {
        await client.release()
        await pool.end()
    }
}



const fetchUser = async (id) => {
    let pool, client;
    try {
        pool = getDBPool(1)
        client = await pool.connect()

        const query = `SELECT * FROM users WHERE id = $1`
        const {rows} = await client.query(query, [id]);
        return {status: 200, msg:"success", res: rows}
    } catch (err) {
        return {status: 400, msg: `error in fetch user ${err}`}
    } finally {
        await client.release()
        await pool.end()
    }
}

const fetchUserFromWallet = async (wallet) => {
    let pool, client;
    try {
        pool = getDBPool(1)
        client = await pool.connect()

        const query = `SELECT * FROM users WHERE public_key = $1`
        const {rows} = await client.query(query, [wallet]);
        return {status: 200, msg:"success", res: rows}
    } catch (err) {
        return {status: 400, msg: `error in fetch user ${err}`}
    } finally {
        await client.release()
        await pool.end()
    }
}

module.exports = {
    getDBPool,
    insertUser,
    fetchUser,
    fetchUserFromWallet
}