use crate::state::Document;
use crate::state::Profile;
use anchor_lang::prelude::*;

use crate::constants::*;
use crate::events::CreateDocument;

pub fn create_document_handler(
    ctx: Context<CreateDocumentContext>, 
    random_hash: [u8;32], 
    description: String, 
    data: String, 
    uri: String
) -> Result<()> {
    let document = &mut ctx.accounts.document_account;

    document.set_inner(Document {
        profile: *ctx.accounts.profile_account.to_account_info().key,
        description,
        data,
        timestamp:Clock::get()?.unix_timestamp,
        uri,
        random_hash
    });

    emit!(CreateDocument{
     document: *document.to_account_info().key,
     profile: *ctx.accounts.profile_account.to_account_info().key,
     random_hash,
     timestamp:Clock::get()?.unix_timestamp,
     description: document.description.clone(),
     uri: document.uri.clone(),
     data: document.data.clone(),
    });
    Ok(())
}

#[derive(Accounts)]
#[instruction(random_hash: [u8;32])]
pub struct CreateDocumentContext<'info> {
    #[account(
        init,
        seeds = [b"document-account",
        profile_account.key().as_ref(),
        DOCUMENT_PREFIX_SEED.as_bytes(),
        random_hash.as_ref(),
        ],
        bump,
        payer = payer,
        space = Document::LEN
    )]
    pub document_account: Account<'info, Document>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [b"profile-account",
        payer.key().as_ref(),
            PROFILE_PREFIX_SEED.as_bytes(),
            profile_account.random_hash.as_ref(),
        ],
        bump = profile_account.bump,
    )]
    pub profile_account: Account<'info, Profile>,

    // The system program
    pub system_program: Program<'info, System>,
}