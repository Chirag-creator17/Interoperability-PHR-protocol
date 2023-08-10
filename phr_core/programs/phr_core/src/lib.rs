use anchor_lang::prelude::*;

declare_id!("GbcXdmj7dycduP6b7FBSq5x9bmDYBjPTbUzvVDrm4TxJ");

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
        random_hash: [u8; 32],
        profile_type: String,
        profile_uri: String,
        info: String,
        data: String
    ) -> Result<()> {
        create_profile_handler(
            ctx,
            random_hash,
            profile_type,
            profile_uri,
            info,
            data
        )
    }

    // Update a User Profile
    pub fn update_profile(
        ctx: Context<UpdateProfileContext>,
        profile_uri: String,
        info: String,
        data: String
    ) -> Result<()> {
        update_profile_handler(
            ctx,
            profile_uri,
            info,
            data
        )
    }

    // Create/ Upload new document 
    pub fn create_document(
        ctx: Context<CreateDocumentContext>, 
        random_hash: [u8;32], 
        description: String, 
        data: String, 
        uri: String
    ) -> Result<()> {
        create_document_handler(
            ctx, 
            random_hash, 
            description, 
            data, 
            uri
        )
    }
}
