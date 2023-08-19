use anchor_lang::prelude::*;

#[account]
pub struct Authority {
    pub authorised: Pubkey,
    pub profile: Pubkey,
    pub authority: Pubkey,
    pub bump: u8
}

impl Authority {
    pub const LEN: usize = 8 + std::mem::size_of::<Self>();
}