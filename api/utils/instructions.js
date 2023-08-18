const anchor = require("@project-serum/anchor");
const randomBytes = require("randombytes");
const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const idl = require("../idl/phr_core.json");
const {
  findProfileAccountPDA,
  findDocumentAccountPDA,
} = require("./solanaHelper.js");

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;

const programId = new PublicKey("GbcXdmj7dycduP6b7FBSq5x9bmDYBjPTbUzvVDrm4TxJ");
const program = new anchor.Program(idl, programId, provider);

const createProfileInstruction = async (
  profileType,
  profileUri,
  info,
  data,
  keypair
) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(keypair, profileType);

    let trx = await program.methods
      .createProfile(profileType, profileUri, info, data)
      .accounts({
        profileAccount: profileAccountPDA,
        payer: provider.wallet.publicKey,
        authority: keypair.publicKey,
      })
      .rpc();

    return {
      status: 200,
      msg: "success",
      trx,
      profile: profileAccountPDA.toString(),
    };
  } catch (err) {
    return { status: 400, msg: `error in create profile instruction ${err}` };
  }
};

const updateProfileInstruction = async (
  profileUri,
  profileType,
  info,
  data,
  keypair
) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(keypair, profileType);

    const trx = await program.methods
      .updateProfile(profileUri, info, data)
      .accounts({
        profileAccount: profileAccountPDA,
        payer: provider.wallet.publicKey,
        authority: keypair.publicKey,
      })
      .rpc();

    return {
      status: 200,
      msg: "success",
      trx,
      profile: profileAccountPDA.toString(),
    };
  } catch (err) {
    return { status: 400, msg: `error in update profile instruction ${err}` };
  }
};

const createDocumentInstruction = async (
  randomHash,
  description,
  data,
  uri,
  profileType,
  keypair
) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(keypair, profileType);

    const documentAccountPDA = findDocumentAccountPDA(
      keypair,
      profileType,
      randomHash
    );
    const trx = await program.methods
      .createDocument(randomHash, description, data, uri)
      .accounts({
        documentAccount: documentAccountPDA,
        payer: provider.wallet.publicKey,
        profileAccount: profileAccountPDA,
        authority: keypair.publicKey,
      })
      .rpc();

    return {
      status: 200,
      msg: "success",
      trx,
      document: documentAccountPDA.toString(),
      profile: profileAccountPDA.toString(),
    };
  } catch (err) {
    return { status: 400, msg: `error in update profile instruction ${err}` };
  }
};

module.exports = {
  createProfileInstruction,
  updateProfileInstruction,
  createDocumentInstruction,
};
