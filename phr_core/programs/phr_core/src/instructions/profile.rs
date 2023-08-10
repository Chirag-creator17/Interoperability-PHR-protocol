use crate::state::Profile;
use anchor_lang::prelude::*;

use crate::constants::*;
use crate::events::{ NewProfile, UpdateProfile };

pub fn create_profile_handler(
    ctx: Context<CreateProfileContext>,
    random_hash: [u8; 32],
    profile_type: String,
    profile_uri: String,
    info: String,
    data: String
) -> Result<()> {
    let profile = &mut ctx.accounts.profile_account;

    profile.set_inner(Profile {
        authority: *ctx.accounts.payer.to_account_info().key,
        profile_type,
        profile_uri,
        info,
        data,
        random_hash,
        bump: *ctx.bumps.get("counter_account").unwrap(),
    });

    emit!(NewProfile {
        profile: *profile.to_account_info().key,
        authority: *ctx.accounts.payer.to_account_info().key,
        random_hash,
        timestamp: Clock::get()?.unix_timestamp,
        profile_type: profile.profile_type.clone(),
        profile_uri: profile.profile_uri.clone(),
        data: profile.data.clone(),
        info: profile.info.clone(),
    });

    Ok(())
}

pub fn update_profile_handler(
    ctx: Context<UpdateProfileContext>,
    profile_uri: String,
    info: String,
    data: String
) -> Result<()> {
    let profile = &mut ctx.accounts.profile_account;

    profile.profile_uri = profile_uri;
    profile.info = info;
    profile.data = data;

    emit!(UpdateProfile{
     profile: *profile.to_account_info().key,
     timestamp: Clock::get()?.unix_timestamp, 
     profile_uri: profile.profile_uri.clone() ,
     data: profile.data.clone(),
     info: profile.data.clone()
    });
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(random_hash: [u8;32], profile_type: String)]
pub struct CreateProfileContext<'info> {
    // The account that will be initialized as a Profile
    #[account(
        init,
        seeds = [b"profile-account",
        payer.key().as_ref(),
            PROFILE_PREFIX_SEED.as_bytes(),
            random_hash.as_ref(),
            profile_type.as_bytes()
        ],
        bump,
        payer = payer,
        space = Profile::LEN
    )]
    pub profile_account: Account<'info, Profile>,

    #[account(mut)]
    pub payer: Signer<'info>,

    // The system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfileContext<'info> {
    #[account(
        mut,
        seeds = [b"profile-account",
        payer.key().as_ref(),
            PROFILE_PREFIX_SEED.as_bytes(),
            profile_account.random_hash.as_ref(),
            profile_account.profile_type.as_bytes()
        ],
        bump = profile_account.bump
    )]
    pub profile_account: Account<'info, Profile>,

    #[account(mut)]
    pub payer: Signer<'info>,
}
