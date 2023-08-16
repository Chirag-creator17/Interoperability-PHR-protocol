const anchor = require("@project-serum/anchor");
const randomBytes = require('randombytes');
const { PublicKey, SystemProgram } = require("@solana/web3.js");
const idl = require('../idl/phr_core.json')

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;

const USER_PREFIX_SEED = "user";
const PROFILE_PREFIX_SEED = "profile";
const PROFILE_METADATA_PREFIX_SEED = "profile_metadata";
const DOCUMENT_PREFIX_SEED = "document";

const programId = new PublicKey("GbcXdmj7dycduP6b7FBSq5x9bmDYBjPTbUzvVDrm4TxJ");
const program = new anchor.Program(idl, programId, provider);

const createProfile = async () => {
    const profileType = 'patient';
    const profileUri = 'https://github.com/kunalchhabra37/counter-program-solana-anchor'
    const info = JSON.stringify({
        name: 'Kunal',
        age: 22
    })
    const data = '';

    const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode("profile-account"),
            provider.wallet.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
            anchor.utils.bytes.utf8.encode(profileType)
        ],
        program.programId
    );
        console.log(profileAccountPDA.toString())
    let trx = await program.methods.createProfile(profileType, profileUri, info, data).accounts({
        profileAccount: profileAccountPDA,
        payer: provider.wallet.publicKey
    }).rpc()

    console.log('Your account: ', profileAccountPDA.toString(), "trx:", trx, "");
}

const updateProfile = async () => {
    const profileType = 'patient';
    const profileUri = 'https://github.com/kunalchhabra37/counter-program-solana-anchor'
    const info = JSON.stringify({
        name: 'Kunal',
        age: 21
    })
    const data = '';

    const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode("profile-account"),
            provider.wallet.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
            anchor.utils.bytes.utf8.encode(profileType)
        ],
        program.programId
    );

    const trx = await program.methods.updateProfile(profileUri, info, data).accounts({
        profileAccount: profileAccountPDA,
        payer: provider.wallet.publicKey
    }).rpc();
    console.log('trx', trx)
}

const createDocument = async () => {
    const randomHash = randomBytes(32);
    const description = JSON.stringify({
        name: "presc",
        doctor: "Doctor A",
        place: "Hospital B"
    })
    const data = "";
    const uri = "https://github.com/kunalchhabra37/counter-program-solana-anchor"
    const profileType = 'patient'
    // console.log(provider.wallet)
    // console.log(provider.wallet.publicKey)
    const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode("profile-account"),
            provider.wallet.publicKey.toBuffer(),
            anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
            anchor.utils.bytes.utf8.encode(profileType)
        ],
        program.programId
    );

    const [documentAccountPDA, __] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode("document-account"),
            profileAccountPDA.toBuffer(),
            anchor.utils.bytes.utf8.encode(DOCUMENT_PREFIX_SEED),
            randomHash
        ],
        program.programId
    );
    
    const trx = await program.methods.createDocument(randomHash, description, data, uri).accounts({
        documentAccount: documentAccountPDA,
        payer: provider.wallet.publicKey,
        profileAccount: profileAccountPDA
    }).rpc()

    console.log("profile", profileAccountPDA.toString(), "document", documentAccountPDA.toString(),"trx", trx)
}


createDocument()