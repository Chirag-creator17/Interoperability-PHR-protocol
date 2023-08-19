use crate::state::Profile;
use crate::state::Authority;
use anchor_lang::prelude::*;

use crate::constants::*;
use crate::events::{ Authorise, RevokeAuthority };

pub fn authorise_handler(ctx: Context<AuthoriseContext>) -> Result<()> {
    let authority = &mut ctx.accounts.authority_account;

    authority.set_inner(Authority {
        authorised: *ctx.accounts.authorised.to_account_info().key,
        profile: *ctx.accounts.profile_account.to_account_info().key,
        authority: *ctx.accounts.authority.to_account_info().key,
        bump: *ctx.bumps.get("authority_account").unwrap(),
    });

    emit!(Authorise {
        authority_account: *ctx.accounts.authority_account.to_account_info().key,
        authorised: *ctx.accounts.authorised.to_account_info().key,
        profile: *ctx.accounts.profile_account.to_account_info().key,
        authority: *ctx.accounts.authority.to_account_info().key,
    });

    Ok(())
}

pub fn revoke_authority_handler(ctx: Context<RevokeAuthorityContext>) -> Result<()> {
    emit!(RevokeAuthority {
        authority_account: *ctx.accounts.authority_account.to_account_info().key,
        authorised: *ctx.accounts.authorised.to_account_info().key,
        profile: *ctx.accounts.profile_account.to_account_info().key,
        authority: *ctx.accounts.authority.to_account_info().key,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct AuthoriseContext<'info> {
    #[account(
        init,
        seeds = [
            b"authority-account",
            profile_account.key().as_ref(),
            authorised.key().as_ref(),
            AUTHORITY_PREFIX_SEED.as_bytes(),
        ],
        bump,
        payer = payer,
        space = Authority::LEN
    )]
    pub authority_account: Account<'info, Authority>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [
            b"profile-account",
            profile_account.id.as_bytes(),
            PROFILE_PREFIX_SEED.as_bytes(),
            profile_account.profile_type.as_bytes(),
        ],
        bump = profile_account.bump,
        has_one = authority
    )]
    pub profile_account: Account<'info, Profile>,

    /// CHECK: Profile account for that particular user
    pub authority: AccountInfo<'info>,

    /// CHECK: Authorise this user
    pub authorised: AccountInfo<'info>,

    // The system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeAuthorityContext<'info> {
    #[account(
        mut,
        seeds = [
            b"authority-account",
            profile_account.key().as_ref(),
            authorised.key().as_ref(),
            AUTHORITY_PREFIX_SEED.as_bytes(),
        ],
        bump = authority_account.bump,
        has_one = authority,
        has_one = authorised,
        close = payer
    )]
    pub authority_account: Account<'info, Authority>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [
            b"profile-account",
            profile_account.id.as_bytes(),
            PROFILE_PREFIX_SEED.as_bytes(),
            profile_account.profile_type.as_bytes(),
        ],
        bump = profile_account.bump,
        has_one = authority
    )]
    pub profile_account: Account<'info, Profile>,

    /// CHECK: Profile account for that particular user
    pub authority: AccountInfo<'info>,

    /// CHECK: Authorise this user
    pub authorised: AccountInfo<'info>,

    // The system program
    pub system_program: Program<'info, System>,
}
