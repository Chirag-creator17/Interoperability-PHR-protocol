const { getDBPool, fetchUserFromWallet } = require("../utils/db.js");
const { fetchProfileInfoByIdRPC } = require("../utils/instructions.js");

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

const fetchUserFromWalletController = async(req, res) => {
  try {
    const wallet = req.body.wallet;
    const resp = await fetchUserFromWallet(wallet)
    if(resp.status === 400){
      res.status(400).send({
        msg: `error in fetching profile from wallet ${resp.msg}`,
      });
    }

    if (resp.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }
    const profile = resp.res[0];
    const fetchProfileRes = await fetchProfileInfoByIdRPC(profile['id'], profile['profile_type'])
    if(fetchProfileRes.status === 400){
      return res.status(400).send({
        msg: fetchProfileRes.msg
      })
    }

    return res.status(200).send({
      msg:"success",
      profile: fetchProfileRes.account
    })
  } catch (err) {
    res.status(400).send({
      msg: `error in fetching profile from wallet ${err}`,
    });
  }
}

module.exports = {
  fetchOtherProfiles,
  fetchUserFromWalletController
}