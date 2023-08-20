const anchor = require("@project-serum/anchor");
const randomBytes = require("randombytes");
const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const idl = require("../idl/phr_core.json");
const {
  findProfileAccountPDA,
  findDocumentAccountPDA,
  findAuthorityAccountPDA,
} = require("./solanaHelper.js");

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;

const programId = new PublicKey("GSiSj8YhmofUYTTppey9H9V2LWCB9JkDvhsx6TQaBAY6");
const program = new anchor.Program(idl, programId, provider);

const createProfileInstruction = async (
  id,
  profileType,
  profileUri,
  info,
  data,
  keypair
) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);

    let trx = await program.methods
      .createProfile(id, profileType, profileUri, info, data)
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
  id,
  profileUri,
  profileType,
  info,
  data,
  keypair
) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);

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
  id,
  randomHash,
  description,
  data,
  uri,
  profileType,
  keypair
) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);

    const documentAccountPDA = findDocumentAccountPDA(
      id,
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

const createAuthorityInstruction = async (id, profileType, authorisedAccount, keypair) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);
    
    const authorityAccountPDA = findAuthorityAccountPDA(id, profileType, authorisedAccount);

    const trx = await program.methods.authorise().accounts({
      authorityAccount: authorityAccountPDA,
      payer: provider.wallet.publicKey,
      profileAccount: profileAccountPDA,
      authority: keypair.publicKey,
      authorised: authorisedAccount
    }).rpc()

    return {status: 200, trx, authorityAccount: authorityAccountPDA}
  } catch (err) {
    console.log(err);
    return { status: 400, msg: `error in create authority instruction ${err}` };
    
  }
}

const revokeAuthorityInstruction = async (id, profileType, authorisedAccount, keypair) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);
    
    const authorityAccountPDA = findAuthorityAccountPDA(id, profileType, authorisedAccount);

    const trx = await program.methods.revokeAuthority().accounts({
      authorityAccount: authorityAccountPDA,
      payer: provider.wallet.publicKey,
      profileAccount: profileAccountPDA,
      authority: keypair.publicKey,
      authorised: authorisedAccount
    }).rpc()

    return {status: 200, trx}
  } catch (error) {
    return { status: 400, msg: `error in error authority instruction ${err}` };
  }
}

// const fetchProfileRPC = async (keypair) => {
//   try {
//     let accounts = await program.account.profile.all(
//       [
//         {
//           memcmp: {
//             offset: 8,
//             bytes: keypair.publicKey.toBase58(),
//           },
//         },
//       ],
//     );

//     accounts = accounts.map((acc) => {
//       acc.publicKey = acc.publicKey.toString();
//       acc.account.authority = acc.account.authority.toString();
//       return acc;
//     });

//     return { status: 200, accounts };
//   } catch (err) {
//     return { status: 400, msg: `error in fetching profile ${err}` };
//   }
// };

const fetchAuthorityFromProfileRPC = async (id, profileType) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);
    let accounts = await program.account.authority.all(
      [
            {
              memcmp: {
                offset: 40,
                bytes: profileAccountPDA.toBase58(),
              },
            },
          ] 
  )
  accounts = accounts.map(acc => {
    acc.publicKey = acc.publicKey.toString()
    acc.account.authorised = acc.account.authorised.toString()
    acc.account.profile = acc.account.profile.toString()
    acc.account.authority = acc.account.authority.toString()
    return acc
  })
  
  return { status: 200, accounts };
  } catch (err) {
    return { status: 400, msg: `error in fetching document ${err}` };
  }
}

const fetchAuthorityFromAuthorisedRPC = async (authorisedAccount) => {
  try {
    let accounts = await program.account.authority.all(
      [
            {
              memcmp: {
                offset: 8,
                bytes: authorisedAccount.toBase58(),
              },
            },
          ] 
  )
  accounts = accounts.map(acc => {
    acc.publicKey = acc.publicKey.toString()
    acc.account.authorised = acc.account.authorised.toString()
    acc.account.profile = acc.account.profile.toString()
    acc.account.authority = acc.account.authority.toString()
    return acc
  })
  
  return { status: 200, accounts };
  } catch (err) {
    return { status: 400, msg: `error in fetching document ${err}` };
  }
}

const fetchDocumentRPC = async (id, profileType) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);
    let accounts = await program.account.document.all(
      [
        {
          memcmp: {
            offset: 8,
            bytes: profileAccountPDA.toBase58(),
          },
        },
      ],
    );
    // console.log(accounts)
    accounts = accounts.map((acc) => {
      acc.publicKey = acc.publicKey.toString();
      acc.account.timestamp = new Date(
        parseInt(acc.account.timestamp)*1000
      ).toString();
      acc.account.profile = acc.account.profile.toString();
      return acc;
    });

    return { status: 200, accounts };
  } catch (err) {
    return { status: 400, msg: `error in fetching document ${err}` };
  }
};

const fetchProfileInfoByIdRPC = async (id, profileType) => {
  try {
    const profileAccountPDA = findProfileAccountPDA(id, profileType);
    let account = await program.account.profile.fetch(profileAccountPDA)
    account.authority = account.authority.toString()
    return {status: 200, account}
  } catch (err) {
    return {status: 400, msg: `error in fetching profile ${err}`}
  }
}

const fetchProfileInfoByAddressRPC = async (profileAccountPDA) => {
  try {
    let account = await program.account.profile.fetch(profileAccountPDA)
    account.authority = account.authority.toString()
    return {status: 200, account}
  } catch (err) {
    return {status: 400, msg: `error in fetching profile ${err}`}
  }
}

module.exports = {
  createProfileInstruction,
  updateProfileInstruction,
  createDocumentInstruction,
  // fetchProfileRPC,
  fetchDocumentRPC,
  createAuthorityInstruction,
  revokeAuthorityInstruction,
  fetchAuthorityFromAuthorisedRPC,
  fetchAuthorityFromProfileRPC,
  fetchProfileInfoByIdRPC,
  fetchProfileInfoByAddressRPC
};
