const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const { insertUser, fetchUser } = require("../utils/db.js");
const { profileInfo, profileTypeCheck } = require("../utils/data.js");
const {
  createProfileInstruction,
  updateProfileInstruction,
  createDocumentInstruction,
  fetchDocumentRPC,
  createAuthorityInstruction,
  revokeAuthorityInstruction,
  fetchAuthorityFromAuthorisedRPC,
  fetchAuthorityFromProfileRPC,
  fetchProfileInfoByIdRPC,
  fetchProfileInfoByAddressRPC
  // fetchProfileRPC
} = require("../utils/instructions.js");
const {
  generateRandomBytes,
  fetchKeypairFromSecret,
} = require("../utils/solanaHelper.js");

const createProfile = async (req, res) => {
  try {
    const id = req.body.id;
    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send(fetchUserRes.msg);
    }
    if (fetchUserRes.status === 200 && fetchUserRes.res.length > 0) {
      const profile = fetchUserRes.res[0];
      const safeProfile = {};
      for (let field in profile) {
        if (field != "secret_key") {
          safeProfile[field] = profile[field];
        }
      }
      return res.status(200).send({
        msg: "profile already present",
        profile: safeProfile,
      });
    }
    const infoIn = req.body.info;
    const profileType = req.body.profileType.toString();
    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }
    const info = profileInfo(profileType, infoIn);
    if (info.err) {
      return res.status(400).send({
        msg: "incorrect profile type, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }

    const profileUri = req.body.profileUri;
    const data = req.body.data;
    const keypair = Keypair.generate();
    const createRes = await createProfileInstruction(
      id,
      profileType,
      profileUri,
      JSON.stringify(info),
      data,
      keypair
    );

    if (createRes.status === 400) {
      return res.status(400).send({
        msg: createRes.msg,
      });
    }
    await insertUser(
      id,
      info.name,
      profileType,
      keypair.publicKey.toString(),
      Array.from(keypair.secretKey),
      info.phone
    );
    return res.status(202).send({
      trx: createRes.trx,
      profile: createRes.profile,
    });
  } catch (err) {
    res.status(400).send({
      msg: `error in creatin profile ${err}`,
    });
  }
};

const createDocument = async (req, res) => {
  try {
    const id = req.body.id;
    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    const profileType = req.body.profileType;
    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }

    const description = req.body.description;
    const data = req.body.data;
    const uri = req.body.uri;
    const randomHash = generateRandomBytes();
    const keypair = fetchKeypairFromSecret(profile["secret_key"]);
    const createRes = await createDocumentInstruction(
      id,
      randomHash,
      description,
      data,
      uri,
      profileType,
      keypair
    );
    if (createRes.status === 400) {
      return res.status(400).send({
        msg: createRes.msg,
      });
    }

    return res.status(202).send({
      trx: createRes.trx,
      profile: createRes.profile,
      document: createRes.document,
    });
  } catch (err) {
    res.status(400).send({
      msg: `error in creating document ${err}`,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.body.id;
    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    const profileType = req.body.profileType;

    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }

    const infoIn = req.body.info;
    const info = profileInfo(profileType, infoIn);
    if (info.err) {
      return res.status(400).send({
        msg: "incorrect profile type, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }

    const profileUri = req.body.profileUri;
    const data = req.body.data;
    const keypair = fetchKeypairFromSecret(profile["secret_key"]);
    const updateRes = await updateProfileInstruction(
      id,
      profileUri,
      profileType,
      JSON.stringify(info),
      data,
      keypair
    );
    if (updateRes.status === 400) {
      return res.status(400).send({
        msg: updateRes.msg,
      });
    }

    return res.status(202).send({
      trx: updateRes.trx,
      profile: updateRes.profile,
    });
  } catch (err) {
    res.status(400).send({
      msg: `error in updating profile ${err}`,
    });
  }
};

// const fetchProfile = async (req,res) => {
//   try {
//     const id = req.body.id;
//     const fetchUserRes = await fetchUser(id);
//     if (fetchUserRes.status === 400) {
//       return res.status(400).send({ msg: fetchUserRes.msg });
//     }

//     if (fetchUserRes.res.length === 0) {
//       return res.status(400).send({ msg: "user not found" });
//     }

//     const profile = fetchUserRes.res[0];
//     const keypair = fetchKeypairFromSecret(profile["secret_key"]);

//     const profileRes = await fetchProfileRPC(keypair)
//     if(profileRes.status === 400){
//       return res.status(400).send({
//         msg: profileRes.msg
//       })
//     }

//     return res.status(200).send({
//       msg:"success",
//       documents: profileRes.accounts
//     })
//   } catch (err) {
//     res.status(400).send({
//       msg:`error in profile fetching: ${err}`
//     })
//   }
// }

const authorise = async (req, res) => {
  try {
    const id = req.body.id;

    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    const profileType = req.body.profileType;

    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }

    const keypair = fetchKeypairFromSecret(profile["secret_key"]);
    const authorisedAccount = new PublicKey(req.body.authorisedAccount)

    const authoriseRes = await createAuthorityInstruction(id, profileType, authorisedAccount, keypair);
    if(authoriseRes.status === 400){
      return res.status(400).send({
        msg: authoriseRes.msg,
      });
    }

    return res.status(202).send({
      trx: authoriseRes.trx,
      authorityAccount: authoriseRes.authorityAccount
    })
  } catch (err) {
    res.status(400).send({
      msg: `error in updating profile ${err}`,
    });
  }
}

const revokeAuthorisation = async (req, res) => {
  try {
    const id = req.body.id;

    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    const profileType = req.body.profileType;

    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }

    const keypair = fetchKeypairFromSecret(profile["secret_key"]);
    const authorisedAccount = new PublicKey(req.body.authorisedAccount)

    const revoekRes = await revokeAuthorityInstruction(id, profileType, authorisedAccount, keypair);
    if(revoekRes.status === 400){
      return res.status(400).send({
        msg: revoekRes.msg,
      });
    }

    return res.status(202).send({
      trx: revoekRes.trx,
    })
  } catch (err) {
    res.status(400).send({
      msg: `error in updating profile ${err}`,
    });
  }
}

const fetchAuthorityFromProfile = async (req, res) => {
  try {
    const id = req.body.id;
    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    const profileType = req.body.profileType;
    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }
    const keypair = fetchKeypairFromSecret(profile["secret_key"]);

    const fetchAuthority = await fetchAuthorityFromProfileRPC(id, profileType)
    if(fetchAuthority.status === 400){
      return res.status(400).send({
        msg: fetchAuthority.msg
      })
    }

    return res.status(200).send({
      msg:"success",
      authority: fetchAuthority.accounts
    })
  } catch (err) {
    res.status(400).send({
      msg:`error in profile fetching: ${err}`
    })
  }
}

const fetchAuthorityFromAuthorised = async (req, res) => {
  try {
    const id = req.body.id;
    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    
    const keypair = fetchKeypairFromSecret(profile["secret_key"]);
    const authorisedAccount = keypair.publicKey
    const fetchAuthority = await fetchAuthorityFromAuthorisedRPC(authorisedAccount)
    if(fetchAuthority.status === 400){
      return res.status(400).send({
        msg: fetchAuthority.msg
      })
    }

    return res.status(200).send({
      msg:"success",
      authority: fetchAuthority.accounts
    })
  } catch (err) {
    res.status(400).send({
      msg:`error in profile fetching: ${err}`
    })
  }
}

const fetchProfileInfoFromId = async (req, res) => {
  try {
    const id = req.body.id;
    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    const profileType = req.body.profileType;
    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }

    const fetchProfileRes = await fetchProfileInfoByIdRPC(id, profileType)
    if(fetchProfileRes.status === 400){
      return res.status(400).send({
        msg: fetchProfileRes.msg
      })
    }

    return res.status(200).send({
      msg:"success",
      documents: fetchProfileRes.account
    })
  } catch (err) {
    res.status(400).send({
      msg:`error in profile fetching: ${err}`
    })
  }
}

const fetchProfileInfoFromAddres = async (req, res) => {
  try {
      
    const profileAccount = new PublicKey(req.body.profileAccount)
    const fetchProfileRes = await fetchProfileInfoByAddressRPC(profileAccount)
    if(fetchProfileRes.status === 400){
      return res.status(400).send({
        msg: fetchProfileRes.msg
      })
    }

    return res.status(200).send({
      msg:"success",
      documents: fetchProfileRes.account
    })
  } catch (err) {
    res.status(400).send({
      msg:`error in profile fetching: ${err}`
    })
  }
}

const fetchDocument = async (req, res) => {
  try {
    const id = req.body.id;
    const fetchUserRes = await fetchUser(id);
    if (fetchUserRes.status === 400) {
      return res.status(400).send({ msg: fetchUserRes.msg });
    }

    if (fetchUserRes.res.length === 0) {
      return res.status(400).send({ msg: "user not found" });
    }

    const profile = fetchUserRes.res[0];
    const profileType = req.body.profileType;
    if (!profileTypeCheck(profileType)) {
      return res.status(400).send({
        msg: "profile type incorrect, choose between: patient, doctor, diaganostic, hospital, clinic",
      });
    }
    const keypair = fetchKeypairFromSecret(profile["secret_key"]);

    const fetchDocRes = await fetchDocumentRPC(id, profileType)
    if(fetchDocRes.status === 400){
      return res.status(400).send({
        msg: fetchDocRes.msg
      })
    }

    return res.status(200).send({
      msg:"success",
      documents: fetchDocRes.accounts
    })
  } catch (err) {
    res.status(400).send({
      msg:`error in profile fetching: ${err}`
    })
  }
}

module.exports = {
  createProfile,
  updateProfile,
  createDocument,
  fetchDocument,
  authorise,
  revokeAuthorisation,
  fetchAuthorityFromAuthorised,
  fetchAuthorityFromProfile,
  fetchProfileInfoFromId,
  fetchProfileInfoFromAddres
  // fetchProfile
};
