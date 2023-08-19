use anchor_lang::prelude::*;

declare_id!("GSiSj8YhmofUYTTppey9H9V2LWCB9JkDvhsx6TQaBAY6");

pub mod constants;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod phr_core {
    use super::*;

    // Create a new User Profile
    pub fn create_profile(
        ctx: Context<CreateProfileContext>,
        id: String,
        profile_type: String,
        profile_uri: String,
        info: String,
        data: String
    ) -> Result<()> {
        create_profile_handler(ctx,id, profile_type, profile_uri, info, data)
    }

    pub fn authorise(
        ctx: Context<AuthoriseContext>
    ) -> Result<()> {
        authorise_handler(ctx)
    }

    pub fn revoke_authority(
        ctx: Context<RevokeAuthorityContext>
    ) -> Result<()> {
        revoke_authority_handler(ctx)
    }

    // Update a User Profile
    pub fn update_profile(
        ctx: Context<UpdateProfileContext>,
        profile_uri: String,
        info: String,
        data: String
    ) -> Result<()> {
        update_profile_handler(ctx, profile_uri, info, data)
    }

    // Create/ Upload new document
    pub fn create_document(
        ctx: Context<CreateDocumentContext>,
        random_hash: [u8; 32],
        description: String,
        data: String,
        uri: String
    ) -> Result<()> {
        create_document_handler(ctx, random_hash, description, data, uri)
    }
}
