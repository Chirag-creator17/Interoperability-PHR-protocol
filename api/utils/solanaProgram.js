const anchor = require("@project-serum/anchor");
const randomBytes = require("randombytes");
const { PublicKey, SystemProgram, Keypair } = require("@solana/web3.js");
const idl = require("../idl/phr_core.json");

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;

const PROFILE_PREFIX_SEED = "profile";
const DOCUMENT_PREFIX_SEED = "document";
const AUTHORITY_PREFIX_SEED = "authority";

const programId = new PublicKey("GSiSj8YhmofUYTTppey9H9V2LWCB9JkDvhsx6TQaBAY6");
const program = new anchor.Program(idl, programId, provider);

const createProfile = async () => {
  const profileType = "patient";
  const profileUri =
    "https://github.com/kunalchhabra37/counter-program-solana-anchor";
  const info = JSON.stringify({
    name: "Kunal",
    age: 22,
  });
  const data = "";
  const id = '11-2345-2345-1234'
  // const keypair = Keypair.generate();
  // console.log(keypair);
  // console.log(Array.from(keypair.secretKey)); // Uint8Array(64)
  // console.log(keypair.publicKey);

  const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
      [
          anchor.utils.bytes.utf8.encode("profile-account"),
          anchor.utils.bytes.utf8.encode(id),
          anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
          anchor.utils.bytes.utf8.encode(profileType)
      ],
      program.programId
  );
      console.log(profileAccountPDA.toString())
  let trx = await program.methods.createProfile(id, profileType, profileUri, info, data).accounts({
      profileAccount: profileAccountPDA,
      payer: provider.wallet.publicKey,
      authority: provider.wallet.publicKey
  }).rpc()

  console.log('Your account: ', profileAccountPDA.toString(), "trx:", trx, "");
};

const updateProfile = async () => {
  const profileType = "patient";
  const profileUri =
    "https://github.com/kunalchhabra37/counter-program-solana-anchor";
  const info = JSON.stringify({
    name: "Kunal",
    age: 21,
  });
  const data = "";
  const id = '11-2345-2345-1234'
  // const secretKey = Uint8Array.from([
  //   216, 139, 86, 4, 78, 28, 171, 254, 110, 41, 145, 95, 69, 175, 183, 226, 155,
  //   39, 141, 151, 189, 107, 89, 122, 48, 31, 45, 223, 248, 135, 163, 6, 227,
  //   214, 33, 194, 119, 166, 204, 27, 85, 200, 220, 176, 29, 91, 55, 191, 59, 69,
  //   62, 42, 253, 144, 244, 215, 252, 139, 68, 212, 151, 24, 207, 57,
  // ]);

  // const keypair = Keypair.fromSecretKey(secretKey);
  const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("profile-account"),
      anchor.utils.bytes.utf8.encode(id),
      anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
      anchor.utils.bytes.utf8.encode(profileType),
    ],
    program.programId
  );

  const trx = await program.methods
    .updateProfile(profileUri, info, data)
    .accounts({
      profileAccount: profileAccountPDA,
      payer: provider.wallet.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc();
  console.log("trx", trx);
};

const createDocument = async () => {
  const randomHash = randomBytes(32);
  const description = JSON.stringify({
    name: "presc",
    doctor: "Doctor A",
    place: "Hospital B",
  });
  const data = "";
  const uri = "https://github.com/kunalchhabra37/counter-program-solana-anchor";
  const profileType = "patient";

//   const secretKey = Uint8Array.from([
//     216, 139, 86, 4, 78, 28, 171, 254, 110, 41, 145, 95, 69, 175, 183, 226, 155,
//     39, 141, 151, 189, 107, 89, 122, 48, 31, 45, 223, 248, 135, 163, 6, 227,
//     214, 33, 194, 119, 166, 204, 27, 85, 200, 220, 176, 29, 91, 55, 191, 59, 69,
//     62, 42, 253, 144, 244, 215, 252, 139, 68, 212, 151, 24, 207, 57,
//   ]);

//   const keypair = Keypair.fromSecretKey(secretKey);
const id = '11-2345-2345-1234'

  const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("profile-account"),
      anchor.utils.bytes.utf8.encode(id),
      anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
      anchor.utils.bytes.utf8.encode(profileType),
    ],
    program.programId
  );

  const [documentAccountPDA, __] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("document-account"),
      profileAccountPDA.toBuffer(),
      anchor.utils.bytes.utf8.encode(DOCUMENT_PREFIX_SEED),
      randomHash,
    ],
    program.programId
  );

  const trx = await program.methods
    .createDocument(randomHash, description, data, uri)
    .accounts({
      documentAccount: documentAccountPDA,
      payer: provider.wallet.publicKey,
      profileAccount: profileAccountPDA,
      authority: provider.wallet.publicKey,
    })
    .rpc();

  console.log(
    "profile",
    profileAccountPDA.toString(),
    "document",
    documentAccountPDA.toString(),
    "trx",
    trx
  );
};

const createAuthority = async () => {
  const profileType = "patient";
  const profileUri =
    "https://github.com/kunalchhabra37/counter-program-solana-anchor";
  const info = JSON.stringify({
    name: "Kunal",
    age: 22,
  });
  const data = "";
  const id = '11-2345-2345-1234'

  const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
    [
        anchor.utils.bytes.utf8.encode("profile-account"),
        anchor.utils.bytes.utf8.encode(id),
        anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
        anchor.utils.bytes.utf8.encode(profileType)
    ],
    program.programId
);
    const [authorityAccountPDA, __] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("authority-account"),
        profileAccountPDA.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(AUTHORITY_PREFIX_SEED),
      ],
      program.programId
    )

    const trx = await program.methods.authorise().accounts({
      authorityAccount: authorityAccountPDA,
      payer: provider.wallet.publicKey,
      profileAccount: profileAccountPDA,
      authority: provider.wallet.publicKey,
      authorised: provider.wallet.publicKey
    }).rpc()

    console.log('trx', trx, 'profile', profileAccountPDA.toString(), 'authority', authorityAccountPDA.toString())
}

const closeAuthority = async () => {
  const profileType = "patient";
  const profileUri =
    "https://github.com/kunalchhabra37/counter-program-solana-anchor";
  const info = JSON.stringify({
    name: "Kunal",
    age: 22,
  });
  const data = "";
  const id = '11-2345-2345-1234'

  const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
    [
        anchor.utils.bytes.utf8.encode("profile-account"),
        anchor.utils.bytes.utf8.encode(id),
        anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
        anchor.utils.bytes.utf8.encode(profileType)
    ],
    program.programId
);
    const [authorityAccountPDA, __] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("authority-account"),
        profileAccountPDA.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(AUTHORITY_PREFIX_SEED),
      ],
      program.programId
    )

    const trx = await program.methods.revokeAuthority().accounts({
      authorityAccount: authorityAccountPDA,
      payer: provider.wallet.publicKey,
      profileAccount: profileAccountPDA,
      authority: provider.wallet.publicKey,
      authorised: provider.wallet.publicKey
    }).rpc()

    console.log('trx', trx, 'profile', profileAccountPDA.toString(), 'authority', authorityAccountPDA.toString())
}

const fetch = async () => {
  const id = "11-2345-2345-1234"

// console.log(anchor.utils.bytes.bs58.encode(Buffer.from(id, 'utf-8')))
    const [profileAccountPDA, _] = PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("profile-account"),
          anchor.utils.bytes.utf8.encode(id),
          anchor.utils.bytes.utf8.encode(PROFILE_PREFIX_SEED),
          anchor.utils.bytes.utf8.encode('patient'),
        ],
        program.programId
      );

      const [authorityAccountPDA, __] = PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode("authority-account"),
          profileAccountPDA.toBuffer(),
          provider.wallet.publicKey.toBuffer(),
          anchor.utils.bytes.utf8.encode(AUTHORITY_PREFIX_SEED),
        ],
        program.programId
      )
//     console.log(profileAccountPDA.toBase58())
//   const accounts = await connection.getParsedProgramAccounts(
//     program.programId,
//     {
//       filters: [
//         {
//           memcmp: {
//             offset: 40,
//             bytes: anchor.utils.bytes.bs58.encode(Buffer.from(id, 'utf-8')),
//           },
//         },
//       ],
//     }
//   );
//   console.log("accounts", accounts);
  // let accounts = await program.account.document.all(
  //   [
  //           {
  //             memcmp: {
  //               offset: 8,
  //               bytes: profileAccountPDA.toBase58(),
  //             },
  //           },
  //         ] 
  // )
  // accounts = accounts.map(acc => {
  //   acc.publicKey = acc.publicKey.toString()
  //   acc.account.timestamp = Date(Number(acc.account.timestamp.toString())*1000)
  //   acc.account.profile = acc.account.profile.toString()
  //   return acc;
  // })

  // console.log(accounts)
  // let accounts = await program.account.authority.all(
  //     [
  //           {
  //             memcmp: {
  //               offset: 8,
  //               bytes: provider.wallet.publicKey.toBase58(),
  //             },
  //           },
  //         ] 
  // )
  // accounts = accounts.map(acc => {
  //   acc.publicKey = acc.publicKey.toString()
  //   acc.account.authorised = acc.account.authorised.toString()
  //   acc.account.profile = acc.account.profile.toString()
  //   acc.account.authority = acc.account.authority.toString()
  //   return acc
  // })
  // console.log(accounts)

//   let accounts = await program.account.authority.all(
//     [
//           {
//             memcmp: {
//               offset: 40,
//               bytes: profileAccountPDA.toBase58(),
//             },
//           },
//         ] 
// )
// accounts = accounts.map(acc => {
//   acc.publicKey = acc.publicKey.toString()
//   acc.account.authorised = acc.account.authorised.toString()
//   acc.account.profile = acc.account.profile.toString()
//   acc.account.authority = acc.account.authority.toString()
//   return acc
// })
    // console.log(accounts)
        console.log(profileAccountPDA.toString())
  let account = await program.account.profile.fetch(profileAccountPDA)
  

    account.authority = account.authority.toString()
   

  console.log(account)
};



fetch();
