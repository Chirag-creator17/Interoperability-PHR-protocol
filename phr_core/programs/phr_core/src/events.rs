use anchor_lang::prelude::*;


#[event]
pub struct NewProfile {
    pub profile: Pubkey,
    pub authority: Pubkey,
    pub timestamp: i64, 
    pub profile_type: String,
    pub profile_uri: String,
    pub data: String,
    pub info: String,
}

#[event]
pub struct UpdateProfile {
    pub profile: Pubkey,
    pub timestamp: i64, 
    pub profile_uri: String,
    pub data: String,
    pub info: String
}

#[event]
pub struct CreateDocument {
    pub document: Pubkey,
    pub profile: Pubkey,
    pub random_hash: [u8; 32],
    pub timestamp: i64,
    pub description: String,
    pub uri: String,
    pub data: String,
}

