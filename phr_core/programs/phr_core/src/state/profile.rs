use anchor_lang::prelude::*;
pub const MAX_LEN_URI: usize = 128;

#[account]
pub struct Profile {
    // Owner of the account(replace with ABHA Health ID)
    pub authority: Pubkey,

    pub id: String,
    // Defines the type of the User
    pub profile_type: String,

    // URI of the info of the profile
    pub profile_uri: String,

    // Non Sensitive public data in form of JSON string.
    pub info: String,

    // Extra Data
    pub data: String,

    pub bump: u8,
}

impl Profile {
    pub const LEN: usize = 8 + MAX_LEN_URI + std::mem::size_of::<Self>();
}

