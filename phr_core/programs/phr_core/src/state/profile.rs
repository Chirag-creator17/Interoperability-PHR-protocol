use anchor_lang::prelude::*;
pub const MAX_LEN_URI: usize = 128;

#[account]
pub struct Profile {
    // Owner of the account(replace with ABHA Health ID)
    pub authority: Pubkey,

    // Defines the type of the User
    // pub profile_type: ProfileType,
    pub profile_type: String,

    // URI of the info of the profile
    pub profile_uri: String,

    // Non Sensitive public data in form of JSON string.
    pub info: String,

    // Sensitive encrypted data
    pub data: String,

    pub bump: u8,
}

impl Profile {
    pub const LEN: usize = 8 + MAX_LEN_URI + std::mem::size_of::<Self>();

    // pub set_profile_type(profile_type: &str) {
    //     self.profile_type
    // }
}

// enum ProfileType {
//     Patient,
//     Doctor,
//     Diagnostics,
//     Clinic,
//     Hospital
// }

// impl ProfileType {
//     pub fn from_in(profile_type: &str) -> Result<ProfileType, _> {
//         match profile_type {
//             "Patient" => Ok(ProfileType::Patient),
//             "Doctor" => Ok(ProfileType::Doctor),
//             "Diagnostics" => Ok(ProfileType::Diagnostics),
//             "Clinic" => Ok(ProfileType::Clinic),
//             "Hospital" => Ok(ProfileType::Hospital)
//         }
//     }
// }