use crate::state::MAX_LEN_URI;
use anchor_lang::prelude::*;

#[account]
pub struct Document {
    // Public Key of the Profile of document owner
    pub profile: Pubkey,

    // Info about document
    pub description: String,

    // Encrypted Sensitive Data
    pub data: String,
    
    // Timestamp when Document created/updated
    pub timestamp: i64,

    // Encrypted URI of Document
    pub uri: String,
    pub random_hash: [u8; 32],
    pub bump: u8,
}

impl Document {
    pub const LEN: usize = 8 + std::mem::size_of::<Self>() + MAX_LEN_URI;
}