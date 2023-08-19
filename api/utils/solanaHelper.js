const randomBytes = require("randombytes");
const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const idl = require("../idl/phr_core.json");
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;
const PROFILE_PREFIX_SEED = "profile";
const DOCUMENT_PREFIX_SEED = "document";
const AUTHORITY_PREFIX_SEED = "authority";

const programId = new PublicKey("GSiSj8YhmofUYTTppey9H9V2LWCB9JkDvhsx6TQaBAY6");
const program = new anchor.Program(idl, programId, provider);

const generateRandomBytes = () => {
  try {
    const randomHash = randomBytes(32);
    return randomHash;
  } catch (err) {
    throw new Error("error in generating hash", err);
  }
};

const fetchKeypairFromSecret = (secretKeyArr) => {
  try {
    const secretKey = Uint8Array.from(secretKeyArr);
    const keypair = Keypair.fromSecretKey(secretKey);
    return keypair;
  } catch (err) {
    throw new Error("error in fetching keypair", err);
  }
};

const findProgramAddress = (seedsArray) => {
  try {
    const [pda, _] = PublicKey.findProgramAddressSync(
      seedsArray,
      program.programId
    );

    return pda;
  } catch (err) {
    throw new Error("error in finding program address", err);
  }
};

const findProfileAccountPDA = (id, profileType) => {
  try {
    const seeds = [
      anchor.utils.bytes.utf8.encode("profile-account"),
      anchor.utils.bytes.utf8.encode(id),
      anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
      anchor.utils.bytes.utf8.encode(profileType),
    ];
    return findProgramAddress(seeds);
  } catch (err) {
    throw new Error("error in finding profile account", err);
  }
};

const findDocumentAccountPDA = (id, profileType, randomHash) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);
    const seeds = [
      anchor.utils.bytes.utf8.encode("document-account"),
      profileAccountPDA.toBuffer(),
      anchor.utils.bytes.utf8.encode(DOCUMENT_PREFIX_SEED),
      randomHash,
    ];
    return findProgramAddress(seeds);
  } catch (err) {
    throw new Error("error in finding document account", err);
  }
};

const findAuthorityAccountPDA = (id, profileType, authorisedAccount) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);
    const seeds = [
      anchor.utils.bytes.utf8.encode("authority-account"),
      profileAccountPDA.toBuffer(),
      authorisedAccount.toBuffer(),
      anchor.utils.bytes.utf8.encode(AUTHORITY_PREFIX_SEED),
    ];
    return findProgramAddress(seeds)
  } catch (err) {
    throw new Error("error in finding authority account", err);
  }
};

module.exports = {
  generateRandomBytes,
  findProfileAccountPDA,
  findDocumentAccountPDA,
  fetchKeypairFromSecret,
  findAuthorityAccountPDA
};
