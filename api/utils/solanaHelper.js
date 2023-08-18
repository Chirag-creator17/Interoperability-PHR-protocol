const randomBytes = require("randombytes");
const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const anchor = require("@project-serum/anchor");
const idl = require("../idl/phr_core.json");
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;
const PROFILE_PREFIX_SEED = "profile";
const DOCUMENT_PREFIX_SEED = "document";

const programId = new PublicKey("GbcXdmj7dycduP6b7FBSq5x9bmDYBjPTbUzvVDrm4TxJ");
const program = new anchor.Program(idl, programId, provider);

const generateRandomBytes = () => {
  const randomHash = randomBytes(32);
  return randomHash;
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

const findProfileAccountPDA = (keypair, profileType) => {
  try {
    const seeds = [
      anchor.utils.bytes.utf8.encode("profile-account"),
      keypair.publicKey.toBuffer(),
      anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
      anchor.utils.bytes.utf8.encode(profileType),
    ];
    return findProgramAddress(seeds);
  } catch (err) {
    throw new Error("error in finding profile account", err);
  }
};

const findDocumentAccountPDA = (keypair, profileType, randomHash) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(keypair, profileType);
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

module.exports = {
  generateRandomBytes,
  findProfileAccountPDA,
  findDocumentAccountPDA,
  fetchKeypairFromSecret,
};
