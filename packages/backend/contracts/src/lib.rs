extern crate quick_protobuf;

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    bpf_loader, entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction, system_program,
};

use spl_associated_token_account::get_associated_token_address;
use spl_token::instruction as spl_instruction;
use std::{cmp::min, str::FromStr};
use std::{convert::TryInto, slice::Iter};

mod openpredict;

use openpredict::{mod_Instruction::OneOfContents, Instruction};
use quick_protobuf::{BytesReader, MessageRead};

fn next_from_pubkey<'a, 'b>(
    iter: &mut Iter<'a, AccountInfo<'b>>,
    key: &Pubkey,
    owner_id: &Pubkey,
) -> Result<&'a AccountInfo<'b>, ProgramError> {
    let account = iter.next().ok_or(ProgramError::NotEnoughAccountKeys)?;
    if account.key.to_bytes() != key.to_bytes() {
        return Err(ProgramError::InvalidAccountData);
    }
    if account.owner.to_bytes() != owner_id.to_bytes() {
        msg!(
            "wrong owner; expected {}, got {}",
            owner_id.to_string(),
            account.owner.to_string()
        );
        return Err(ProgramError::IllegalOwner);
    }
    return Ok(account);
}

fn next_from_address<'a, 'b>(
    iter: &mut Iter<'a, AccountInfo<'b>>,
    seeds: &[&[u8]],
    program_id: &Pubkey,
    owner_id: Option<&Pubkey>,
) -> Result<(&'a AccountInfo<'b>, u8), ProgramError> {
    let account = iter.next().ok_or(ProgramError::NotEnoughAccountKeys)?;
    let (addr, bump_seed) = Pubkey::find_program_address(seeds, program_id);
    if account.key.to_bytes() != addr.to_bytes() {
        return Err(ProgramError::InvalidAccountData);
    }
    match owner_id {
        None => {}
        Some(owner_id) => {
            if account.owner.to_bytes() != owner_id.to_bytes() {
                msg!(
                    "wrong owner; expected {}, got {}",
                    owner_id.to_string(),
                    account.owner.to_string()
                );
                return Err(ProgramError::IllegalOwner);
            }
        }
    }
    return Ok((account, bump_seed));
}

fn next_amm_account<'a, 'b>(
    iter: &mut Iter<'a, AccountInfo<'b>>,
    amm_address: &[u8],
    program_id: &Pubkey,
    resolved: bool,
) -> Result<(&'a AccountInfo<'b>, &'b mut [u8], u8), ProgramError> {
    let (amm_account, bump_seed) = next_from_address(
        iter,
        &[amm_address, "data".as_bytes()],
        program_id,
        Some(program_id),
    )?;
    let amm_account_data = amm_account.data.take();

    //AMM Account data version must be 1
    //AMM Version must be 1
    //AMM Account data "resolved byte" must be as expected
    if amm_account_data[0] != 1
        || amm_account_data[1] != 1
        || ((amm_account_data[2] != 0) != resolved)
    {
        return Err(ProgramError::UninitializedAccount);
    }
    return Ok((amm_account, amm_account_data, bump_seed));
}

fn next_amm_share_account<'a, 'b>(
    iter: &mut Iter<'a, AccountInfo<'b>>,
    amm_address: &[u8],
    user_id: &Pubkey,
    program_id: &Pubkey,
) -> Result<(&'a AccountInfo<'b>, &'b mut [u8], u8), ProgramError> {
    let (share_account, bump_seed) = next_from_address(
        iter,
        &[amm_address, "users".as_bytes(), &user_id.to_bytes()],
        program_id,
        Some(program_id),
    )?;
    let amm_share_account_data = share_account.data.take();
    if amm_share_account_data[0] != 2 || amm_share_account_data[1] != 1 {
        msg!("uninitialized amm share account");
        return Err(ProgramError::UninitializedAccount);
    }
    return Ok((share_account, amm_share_account_data, bump_seed));
}

// declare and export the program's entrypoint
entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    if !(user.is_signer && user.is_writable) {
        panic!("Did not supply user account as first account");
    }

    let native_loader_id = Pubkey::from_str("NativeLoader1111111111111111111111111111111").unwrap();
    let env_mint_authority_addr: Option<&'static str> = option_env!("USDC_MINT_AUTH_ADDR");
    let usdc_mint_authority_addr: Pubkey = match env_mint_authority_addr {
        Option::None => Pubkey::from_str("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").unwrap(),
        Option::Some(v) => Pubkey::from_str(v).unwrap(),
    };
    let fee_payer = next_account_info(account_info_iter)?;
    if !fee_payer.is_signer {
        panic!("Did not supply fee payer account");
    }
    match option_env!("FEE_PAYER_KEY") {
        Option::None => {
            if fee_payer.key != user.key {
                panic!(
                    "Fee payer is neither the user's account nor the one the contract was compiled with"
                );
            }
        }
        Option::Some(fee_payer_key_str) => {
            let fee_payer_key = Pubkey::from_str(fee_payer_key_str).unwrap();
            if fee_payer.key != user.key && &fee_payer_key != user.key {
                panic!(
                    "Fee payer is neither the user's account nor the one the contract was compiled with"
                );
            }
        }
    };

    let mut reader = BytesReader::from_bytes(instruction_data);
    let instruction =
        Instruction::from_reader(&mut reader, instruction_data).expect("couldnt read instruction");
    match instruction.Contents {
        OneOfContents::initMarket(data) => {
            //Accounts
            msg!("getting assoc token acc");
            let user_assoc_token_acc = next_from_pubkey(
                account_info_iter,
                &get_associated_token_address(user.key, &usdc_mint_authority_addr),
                &spl_token::ID,
            )?;
            msg!("getting uninitted amm acc");
            let (amm_account, bump_seed) = next_from_address(
                account_info_iter,
                &[&data.amm_address, "data".as_bytes()],
                program_id,
                Some(&system_program::ID),
            )?;
            msg!("getting uninitted amm assoc token acc");
            let amm_assoc_token_acc = next_from_pubkey(
                account_info_iter,
                &get_associated_token_address(amm_account.key, &usdc_mint_authority_addr),
                &system_program::ID,
            )?;
            msg!("getting mint authority");
            let usdc_mint_authority =
                next_from_pubkey(account_info_iter, &usdc_mint_authority_addr, &spl_token::ID)?;
            msg!("getting system account");
            let system_account =
                next_from_pubkey(account_info_iter, &system_program::ID, &native_loader_id)?;
            msg!("getting spl token account");
            let spl_token_account =
                next_from_pubkey(account_info_iter, &spl_token::ID, &bpf_loader::ID)?;
            msg!("getting spl assoc token account");
            let spl_assoc_token_account = next_from_pubkey(
                account_info_iter,
                &spl_associated_token_account::ID,
                &bpf_loader::ID,
            )?;

            let rent = Rent::default();
            let ipfs_len = data.cid.len();
            let amm_account_len = 3 + 8 * 3 + 1 + ipfs_len + 32 + 32;
            let rent_lamports = rent.minimum_balance(amm_account_len);
            msg!("making amm account");
            invoke_signed(
                &system_instruction::create_account(
                    fee_payer.key,
                    amm_account.key,
                    rent_lamports,
                    amm_account_len.try_into().unwrap(),
                    program_id,
                ),
                &[user.clone(), amm_account.clone(), system_account.clone()],
                &[&[&data.amm_address, "data".as_bytes(), &[bump_seed]]],
            )?;

            //Validate and then initialize account data
            let amm_account_data = amm_account.data.take();
            if amm_account_data[0] != 0 {
                return Err(ProgramError::InvalidAccountData);
            }
            amm_account_data[0] = 1;
            amm_account_data[1] = 1;
            amm_account_data[2] = 0;
            let b = data.subsidy.to_le_bytes();
            for n in 0..8 {
                amm_account_data[3 + n] = b[n];
                amm_account_data[11 + n] = b[n];
                amm_account_data[19 + n] = b[n];
            }
            amm_account_data[27] = ipfs_len.try_into().unwrap();
            for n in 0..ipfs_len {
                amm_account_data[28 + n] = data.cid[n];
            }
            for n in 0..32 {
                amm_account_data[28 + ipfs_len + n] = user.key.to_bytes()[n];
                amm_account_data[60 + ipfs_len + n] = data.amm_address[n];
            }

            msg!("making associated usdc token address");
            invoke(
                &spl_associated_token_account::instruction::create_associated_token_account(
                    &fee_payer.key,
                    &amm_account.key,
                    &usdc_mint_authority_addr,
                    &spl_token::ID,
                ),
                &[
                    user.clone(),
                    amm_assoc_token_acc.clone(),
                    amm_account.clone(),
                    usdc_mint_authority.clone(),
                    system_account.clone(),
                    spl_token_account.clone(),
                    spl_assoc_token_account.clone(),
                ],
            )?;

            msg!("making transfer");
            invoke(
                &spl_instruction::transfer(
                    &spl_token::ID,
                    &user_assoc_token_acc.key,
                    &amm_assoc_token_acc.key,
                    &user.key,
                    &[&user.key],
                    data.subsidy,
                )?,
                &[
                    user_assoc_token_acc.clone(),
                    amm_assoc_token_acc.clone(),
                    user.clone(),
                    spl_token_account.clone(),
                ],
            )?;
            Ok(())
        }
        OneOfContents::initMarketAccount(_) => {
            //TODO: Remove this
            Ok(())
        }
        OneOfContents::buyShares(data) => {
            msg!("grabbing accounts");

            //Accounts
            let user_assoc_token_acc = next_from_pubkey(
                account_info_iter,
                &get_associated_token_address(user.key, &usdc_mint_authority_addr),
                &spl_token::ID,
            )?;
            let (amm_account, amm_account_data, amm_bump_seed) =
                next_amm_account(account_info_iter, &data.amm_address, program_id, false)?;
            let amm_assoc_token_acc = next_from_pubkey(
                account_info_iter,
                &get_associated_token_address(amm_account.key, &usdc_mint_authority_addr),
                &spl_token::ID,
            )?;
            let (share_account, share_bump_seed) = next_from_address(
                account_info_iter,
                &[&data.amm_address, "users".as_bytes(), user.key.as_ref()],
                program_id,
                None,
            )?;
            let spl_token_account =
                next_from_pubkey(account_info_iter, &spl_token::ID, &bpf_loader::ID)?;
            let system_account =
                next_from_pubkey(account_info_iter, &system_program::ID, &native_loader_id)?;

            msg!("finished getting accounts");

            let share_account_data: &mut [u8];

            if share_account.lamports() == 0 {
                //Creates account for shares
                let account_len = 1 + 1 + 32 + 8 + 32 + 64; //Account ID (2 == market account) + Version + User Key + 8 bytes for int64 + AMM_Address + 64 bytes padding
                let rent = Rent::default();
                let rent_lamports = rent.minimum_balance(account_len);

                msg!("initting nonexistent share account");
                invoke_signed(
                    &system_instruction::create_account(
                        fee_payer.key,
                        share_account.key,
                        rent_lamports,
                        account_len.try_into().unwrap(),
                        program_id,
                    ),
                    &[user.clone(), share_account.clone(), system_account.clone()],
                    &[&[
                        &data.amm_address,
                        "users".as_bytes(),
                        user.key.as_ref(),
                        &[share_bump_seed],
                    ]],
                )?;
                msg!("initted market account");
                share_account_data = share_account.data.take();
                if share_account_data[0] != 0 {
                    return Err(ProgramError::AccountAlreadyInitialized);
                } else {
                    //Set account id to 2, version to 1, and user pubkey
                    share_account_data[0] = 2;
                    share_account_data[1] = 1;
                    for n in 0..8 {
                        share_account_data[2 + 32 + n] = 0;
                    }
                    for n in 0..32 {
                        share_account_data[2 + n] = user.key.to_bytes()[n];
                        share_account_data[2 + 32 + 8 + n] = data.amm_address[n];
                    }
                }
            } else {
                msg!(
                    "existing share account; lamports {}",
                    share_account.lamports().to_string()
                );
                if share_account.owner.to_bytes() != program_id.to_bytes() {
                    return Err(ProgramError::IllegalOwner);
                }
                share_account_data = share_account.data.take();
                if share_account_data[0] != 2 || share_account_data[1] != 1 {
                    return Err(ProgramError::UninitializedAccount);
                }
            }

            let mut user_shares = i64::from_le_bytes(
                share_account_data[34..42]
                    .try_into()
                    .expect("should not fail"),
            ) as i128;

            msg!("getting amm subsidy");

            let subsidy = u64::from_le_bytes(
                (&amm_account_data[3..11])
                    .try_into()
                    .expect("should never happen"),
            ) as i128;
            msg!("getting amm yes shares");
            let mut num_amm_yes_shares = u64::from_le_bytes(
                amm_account_data[11..19]
                    .try_into()
                    .expect("should never happen"),
            ) as i128;
            let mut num_amm_no_shares = u64::from_le_bytes(
                amm_account_data[19..27]
                    .try_into()
                    .expect("should never happen"),
            ) as i128;

            let init_user_shares = user_shares;
            let micro_usdc = data.micro_usdc as i128;
            let drift = data.drift as i128;
            let expected_amount = data.expected_amount as i128;
            let mut balance = micro_usdc.checked_neg().unwrap();

            if data.direction {
                num_amm_no_shares += micro_usdc;
                let init_shares = num_amm_yes_shares;
                num_amm_yes_shares = subsidy
                    .checked_pow(2)
                    .unwrap()
                    .checked_div(num_amm_no_shares)
                    .unwrap();
                if subsidy
                    .checked_pow(2)
                    .unwrap()
                    .checked_rem(num_amm_no_shares)
                    .unwrap()
                    != 0
                {
                    num_amm_yes_shares += 1;
                }
                let diff = micro_usdc
                    .checked_add(init_shares.checked_sub(num_amm_yes_shares).unwrap())
                    .unwrap();
                if drift < expected_amount && diff < expected_amount.checked_sub(drift).unwrap() {
                    return Err(ProgramError::InvalidArgument);
                }
                user_shares += diff;
                if init_user_shares < 0 {
                    balance = balance
                        .checked_add(min(init_user_shares.checked_neg().unwrap(), diff))
                        .unwrap();
                }
            } else {
                num_amm_yes_shares += micro_usdc;
                let init_shares = num_amm_no_shares;
                num_amm_no_shares = subsidy
                    .checked_pow(2)
                    .unwrap()
                    .checked_div(num_amm_yes_shares)
                    .unwrap();
                if subsidy
                    .checked_pow(2)
                    .unwrap()
                    .checked_rem(num_amm_yes_shares)
                    .unwrap()
                    != 0
                {
                    num_amm_no_shares += 1;
                }
                let diff = micro_usdc
                    .checked_add(init_shares.checked_sub(num_amm_no_shares).unwrap())
                    .unwrap();
                if drift < expected_amount && diff < expected_amount.checked_sub(drift).unwrap() {
                    return Err(ProgramError::InvalidArgument);
                }
                user_shares -= diff;
                if init_user_shares > 0 {
                    balance = balance.checked_add(min(init_user_shares, diff)).unwrap();
                }
            }

            if balance > 0 {
                invoke_signed(
                    &spl_instruction::transfer(
                        &spl_token::ID,
                        &amm_assoc_token_acc.key,
                        &user_assoc_token_acc.key,
                        &amm_account.key,
                        &[&amm_account.key],
                        balance.try_into().unwrap(),
                    )?,
                    &[
                        amm_assoc_token_acc.clone(),
                        user_assoc_token_acc.clone(),
                        amm_account.clone(),
                        spl_token_account.clone(),
                    ],
                    &[&[&data.amm_address, "data".as_bytes(), &[amm_bump_seed]]],
                )?;
            } else {
                invoke(
                    &spl_instruction::transfer(
                        &spl_token::ID,
                        &user_assoc_token_acc.key,
                        &amm_assoc_token_acc.key,
                        &user.key,
                        &[&user.key],
                        balance.checked_neg().unwrap().try_into().unwrap(),
                    )?,
                    &[
                        user_assoc_token_acc.clone(),
                        amm_assoc_token_acc.clone(),
                        user.clone(),
                        spl_token_account.clone(),
                    ],
                )?;
            }

            msg!(
                "new balances: {} {} {}",
                num_amm_yes_shares,
                num_amm_no_shares,
                user_shares
            );
            let yes_b_n: u64 = num_amm_yes_shares.try_into().unwrap();
            let yes_b = yes_b_n.to_le_bytes();
            let no_b_n: u64 = num_amm_no_shares.try_into().unwrap();
            let no_b = no_b_n.to_le_bytes();
            let user_shares_b_n: i64 = user_shares.try_into().unwrap();
            let user_shares_b = user_shares_b_n.to_le_bytes();
            for n in 0..8 {
                amm_account_data[11 + n] = yes_b[n];
                amm_account_data[19 + n] = no_b[n];
                share_account_data[34 + n] = user_shares_b[n];
            }
            Ok(())
        }
        OneOfContents::resolveMarket(data) => {
            //Accounts
            let (_amm_account, amm_account_data, _bump_seed) =
                next_amm_account(account_info_iter, &data.amm_address, program_id, false)?;

            let ipfs_len: usize = amm_account_data[27].try_into().unwrap();
            if user.key.to_bytes() != amm_account_data[28 + ipfs_len..28 + ipfs_len + 32] {
                return Err(ProgramError::IllegalOwner);
            }

            //Set resolution byte
            if data.direction {
                amm_account_data[2] = 2;
            } else {
                amm_account_data[2] = 1;
            }

            Ok(())
        }
        OneOfContents::redeemShares(data) => {
            //Accounts
            let user_assoc_token_acc = next_from_pubkey(
                account_info_iter,
                &get_associated_token_address(user.key, &usdc_mint_authority_addr),
                &spl_token::ID,
            )?;
            let (amm_account, amm_account_data, bump_seed) =
                next_amm_account(account_info_iter, &data.amm_address, program_id, true)?;
            let amm_assoc_token_acc = next_from_pubkey(
                account_info_iter,
                &get_associated_token_address(amm_account.key, &usdc_mint_authority_addr),
                &spl_token::ID,
            )?;
            let (share_account, share_account_data, _bump_seed_share) = next_amm_share_account(
                account_info_iter,
                &data.amm_address,
                &user.key,
                program_id,
            )?;
            if !share_account.is_writable {
                return Err(ProgramError::InvalidAccountData);
            }
            let spl_token_account =
                next_from_pubkey(account_info_iter, &spl_token::ID, &bpf_loader::ID)?;

            let resolved_yes = amm_account_data[2] == 2;

            //Validate share account matches
            if share_account_data[2..34] != user.key.to_bytes() {
                return Err(ProgramError::InvalidAccountData);
            }

            let user_shares = i64::from_le_bytes(
                share_account_data[34..42]
                    .try_into()
                    .expect("should not fail"),
            );

            msg!("about to transfer");
            if resolved_yes && user_shares > 0 {
                invoke_signed(
                    &spl_instruction::transfer(
                        &spl_token::ID,
                        &amm_assoc_token_acc.key,
                        &user_assoc_token_acc.key,
                        &amm_account.key,
                        &[&amm_account.key],
                        user_shares.try_into().unwrap(),
                    )?,
                    &[
                        amm_assoc_token_acc.clone(),
                        user_assoc_token_acc.clone(),
                        amm_account.clone(),
                        spl_token_account.clone(),
                    ],
                    &[&[&data.amm_address, "data".as_bytes(), &[bump_seed]]],
                )?;
            } else if !resolved_yes && user_shares < 0 {
                invoke_signed(
                    &spl_instruction::transfer(
                        &spl_token::ID,
                        &amm_assoc_token_acc.key,
                        &user_assoc_token_acc.key,
                        &amm_account.key,
                        &[&amm_account.key],
                        user_shares.checked_neg().unwrap().try_into().unwrap(),
                    )?,
                    &[
                        amm_assoc_token_acc.clone(),
                        user_assoc_token_acc.clone(),
                        amm_account.clone(),
                        spl_token_account.clone(),
                    ],
                    &[&[&data.amm_address, "data".as_bytes(), &[bump_seed]]],
                )?;
            }
            msg!("finished spl transfer");

            //Set number of shares to zero
            for n in 34..42 {
                share_account_data[n] = 0;
            }

            Ok(())
        }
        OneOfContents::createAccount(data) => {
            if !(data.username.chars().all(char::is_alphanumeric)) {
                return Err(ProgramError::InvalidInstructionData);
            }

            let username_lower = data.username.to_lowercase();

            //Accounts
            let (username_account, bump_seed) = next_from_address(
                account_info_iter,
                &["username".as_bytes(), username_lower.as_bytes()],
                program_id,
                None,
            )?;

            let ipfs_len = data.cid.len();
            let username_account_data: &mut [u8];

            if username_account.lamports() == 0 {
                //Getting accounts
                let (profile_account, profile_bump_seed) = next_from_address(
                    account_info_iter,
                    &["profile".as_bytes(), &user.key.to_bytes()],
                    program_id,
                    None,
                )?;
                let system_account =
                    next_from_pubkey(account_info_iter, &system_program::ID, &native_loader_id)?;

                let username_entry_len = 2 + 32 + 1 + ipfs_len + 1 + data.username.len() + 64;
                let rent = Rent::default();
                let rent_lamports = rent.minimum_balance(username_entry_len);

                invoke_signed(
                    &system_instruction::create_account(
                        fee_payer.key,
                        username_account.key,
                        rent_lamports,
                        username_entry_len.try_into().unwrap(),
                        program_id,
                    ),
                    &[
                        user.clone(),
                        username_account.clone(),
                        system_account.clone(),
                    ],
                    &[&[
                        &"username".as_bytes(),
                        &username_lower.as_bytes(),
                        &[bump_seed],
                    ]],
                )?;
                username_account_data = username_account.data.take();
                username_account_data[0] = 3;
                username_account_data[1] = 1;
                let user_key_b = user.key.to_bytes();
                for n in 0..user_key_b.len() {
                    username_account_data[2 + n] = user_key_b[n];
                }

                //Skip CID (Do later)
                username_account_data[2 + 32 + 1 + ipfs_len] =
                    data.username.len().try_into().unwrap();
                for n in 0..data.username.len() {
                    username_account_data[2 + 32 + 1 + ipfs_len + 1 + n] =
                        data.username.as_bytes()[n];
                }

                if profile_account.lamports() != 0 {
                    return Err(ProgramError::AccountAlreadyInitialized);
                }

                let profile_entry_len = 2 + 32 + 1 + data.username.len() + 64;
                let profile_rent_lamports = rent.minimum_balance(profile_entry_len);
                invoke_signed(
                    &system_instruction::create_account(
                        fee_payer.key,
                        profile_account.key,
                        profile_rent_lamports,
                        profile_entry_len.try_into().unwrap(),
                        program_id,
                    ),
                    &[
                        user.clone(),
                        profile_account.clone(),
                        system_account.clone(),
                    ],
                    &[&[
                        &"profile".as_bytes(),
                        &user.key.to_bytes(),
                        &[profile_bump_seed],
                    ]],
                )?;
                let profile_account_data = profile_account.data.take();
                profile_account_data[0] = 4;
                profile_account_data[1] = 1;
                for n in 0..user_key_b.len() {
                    profile_account_data[2 + n] = user_key_b[n];
                }
                let username_len: usize = data.username.len().try_into().unwrap();
                profile_account_data[2 + 32] = username_len.try_into().unwrap();
                for n in 0..username_len {
                    profile_account_data[2 + 32 + 1 + n] = data.username.as_bytes()[n];
                }
            } else {
                if username_account.owner.to_bytes() != program_id.to_bytes() {
                    return Err(ProgramError::IllegalOwner);
                }
                username_account_data = username_account.data.take();
                if username_account_data[0] != 3 || username_account_data[1] != 1 {
                    return Err(ProgramError::InvalidAccountData);
                }
                if username_account_data[2..2 + 32] != user.key.to_bytes() {
                    return Err(ProgramError::InvalidAccountData);
                }

                let (profile_account, _) = next_from_address(
                    account_info_iter,
                    &["profile".as_bytes(), &user.key.to_bytes()],
                    program_id,
                    Some(program_id),
                )?;

                if profile_account.lamports() == 0 {
                    return Err(ProgramError::UninitializedAccount);
                }
                let profile_account_data = profile_account.data.take();
                if profile_account_data[0] != 4 || profile_account_data[1] != 1 {
                    return Err(ProgramError::InvalidAccountData);
                }
                if profile_account_data[2..2 + 32] != user.key.to_bytes() {
                    return Err(ProgramError::InvalidAccountData);
                }
                if profile_account_data[2 + 32 + 1..2 + 32 + 1 + data.username.len()].as_ref()
                    != data.username.as_bytes()
                {
                    return Err(ProgramError::InvalidAccountData);
                }
            }
            username_account_data[2 + 32] = data.cid.len().try_into().unwrap();
            for n in 0..data.cid.len() {
                username_account_data[2 + 32 + 1 + n] = data.cid[n];
            }
            Ok(())
        }
        OneOfContents::None => Err(ProgramError::InvalidArgument),
    }
}
