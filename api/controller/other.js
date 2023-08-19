const { getDBPool } = require("../utils/db.js");

const fetchOtherProfiles = async (req, res) => {
  let pool, client;
  try {
    pool = getDBPool(1);
    client = await pool.connect();
    const query = " SELECT * from users where profile_type != 'patient'";
    let { rows } = await client.query(query);

    rows = rows.map((profile) => {
      const safeProfile = {};
      for (let field in profile) {
        if (field != "secret_key") {
          safeProfile[field] = profile[field];
        }
      }
      return safeProfile
    });

    return res.status(200).send({
        profiles: rows
    })
  } catch (err) {
    res.status(400).send({
      msg: `error in fetching other profiles`,
    });
  } finally{
    await client.release()
    await pool.end()
  }
};

module.exports = {
  fetchOtherProfiles
}