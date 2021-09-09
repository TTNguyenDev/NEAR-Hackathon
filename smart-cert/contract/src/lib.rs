use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
// use std::collections::{HashMap};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Deserialize, Serialize};

use near_contract_standards::non_fungible_token::metadata::{
    NFTContractMetadata, NonFungibleTokenMetadataProvider, TokenMetadata, NFT_METADATA_SPEC,
};
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_contract_standards::non_fungible_token::NonFungibleToken;
use near_sdk::collections::LazyOption;
use near_sdk::json_types::ValidAccountId;
use near_sdk::{
    setup_alloc, env, near_bindgen, AccountId, BorshStorageKey, PanicOnDefault, Promise, PromiseOrValue,
};

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
    NonFungibleToken,
    Metadata,
    TokenMetadata,
    Enumeration,
    Approval,
}

setup_alloc!();
// #[global_allocator]
// static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

// Define Model
// #[near_bindgen]
// #[derive(Copy, Clone)]
#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct UserInfo {
    pub name: String,
    pub dob: String,
    pub national_id: String,
    pub from: Issuer, 
    pub owner: ValidAccountId 
}

#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenSerialize {
    pub token_id: String,
    pub owner_id: String,
    pub metadata: TokenMetadata,
    pub tx: String,
}

// #[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CertInfo {
    pub user_info: UserInfo,
    pub is_first_approved: bool,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct SmartCertificateContract{
    owner: AccountId, //Owners of this contract, the only person can add more issuers
    issuers: UnorderedMap<AccountId, Issuer>, //List of issuers, only issuers in this list can create a cert
    need_user_approved: UnorderedMap<String, CertInfo>, 
    ready_deploy_nft: UnorderedMap<String, CertInfo>, 

    //NFT Define
    nft_cert: UnorderedMap<String, TokenSerialize>,
    nft_token: NonFungibleToken,
    metadata: LazyOption<NFTContractMetadata>,

}

// #[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Issuer {
    pub name: String,
    pub issuer_id: AccountId 
}

impl Default for SmartCertificateContract {
    fn default() -> Self {
        env::panic(b"SmartCertificate contract should be initialized before usage")
    }
}

const DATA_IMAGE_SVG_NEAR_ICON: &str = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";

#[near_bindgen]
impl SmartCertificateContract {
    #[init]
    pub fn new(nft_owner: ValidAccountId) -> Self {
        assert!(!env::state_exists(), "The contract is already initialized");
        assert!(
            env::is_valid_account_id(env::predecessor_account_id().as_bytes()),
            "The NEAR Foundation account ID is invalid"
        );

        let metadata = NFTContractMetadata {
                spec: NFT_METADATA_SPEC.to_string(),
                name: "Example NEAR non-fungible token".to_string(),
                symbol: "EXAMPLE".to_string(),
                icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),
                base_uri: None,
                reference: None,
                reference_hash: None,
            };

        SmartCertificateContract {
            owner: env::predecessor_account_id(),
            issuers: UnorderedMap::new(b"i".to_vec()),
            need_user_approved: UnorderedMap::new(b"n".to_vec()),
            ready_deploy_nft: UnorderedMap::new(b"r".to_vec()),
            nft_cert: UnorderedMap::new(b"nft".to_vec()),
            nft_token: NonFungibleToken::new(
                StorageKey::NonFungibleToken,
                nft_owner,
                Some(StorageKey::TokenMetadata),
                Some(StorageKey::Enumeration),
                Some(StorageKey::Approval),
            ),
             metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
        }
    }

    pub fn add_issuer(&mut self, issuer_account: AccountId, name: String) -> bool {
        assert!(
            env::is_valid_account_id(issuer_account.as_bytes()),
            "The given account ID is invalid"
        );

        self.assert_called_by_foundation();

        if !self.issuers.get(&issuer_account).is_some() {
            let new_issuer = Issuer {
                name: name,
                issuer_id: issuer_account.clone(),
            };
            self.issuers.insert(&issuer_account, &new_issuer);
            return true;
        }
        return false;
    }

    pub fn create_cert(&mut self, user_account_id: ValidAccountId, name: String, dob: String, national_id: String) {
        self.assert_called_by_issuers();

        let issuer = self.issuers.get(&env::predecessor_account_id()).clone().unwrap();
        let user = UserInfo {
            name: name,
            dob: dob,
            national_id: national_id,
            from: issuer.clone(), 
            owner: user_account_id.clone()
        };

        let cert_info = CertInfo {
            user_info: user,
            is_first_approved: false
        };

        let id = self.generate_cert_key(user_account_id.clone(), env::predecessor_account_id());
        self.need_user_approved.insert(&id, &cert_info);
    }

    pub fn user_approved(&mut self, id: String) {
        let cert = self.need_user_approved.get(&id).unwrap();
        let new_cert = CertInfo {
            user_info: cert.user_info.clone(),
            is_first_approved: true
        };

         env::log(
            format!(
                "new cert @{}",
                new_cert.user_info.owner 
            ).as_bytes()
        );

        self.need_user_approved.remove(&id);
        self.ready_deploy_nft.insert(&id, &new_cert);
    }

    #[payable]
    pub fn nft_mint(
        &mut self,
        id: String,
    ) {
        self.assert_called_by_foundation();
        let cert = self.ready_deploy_nft.get(&id).unwrap();
        let owner = cert.user_info.owner;
        let token = self.nft_token.mint(self.nft_cert.len().to_string(), owner, Some(self.create_meta_data()));

        let token_serialize = TokenSerialize {
            token_id: token.token_id,
            owner_id: token.owner_id,
            metadata: token.metadata.unwrap(),
            tx: "".to_string() 
       };

        self.nft_cert.insert(&id.clone(), &token_serialize); 
    }

    pub fn finalize(&mut self, id: String, txid: String) {
        let mut token = self.nft_cert.get(&id.clone()).unwrap();
        token.tx = txid;

        self.ready_deploy_nft.remove(&id.clone());
    }

    pub fn get_issuers(&self) -> Vec<(AccountId, Issuer)> {
        return self.issuers.to_vec();
    }

    pub fn get_certs(&self) -> Vec<(String, TokenSerialize)> {
        return self
            .nft_cert
            .iter()
            .collect();
    }
 
    pub fn get_un_approved_cert(&self, owner_id: String) -> Vec<(String, CertInfo)> {
       return self.need_user_approved
           .iter()
           .filter(|(_k, v)| String::from(v.user_info.owner.clone()) == owner_id)
           .collect();
    }
        
    pub fn get_ready_deploy_cert(&self) -> Vec<(String, CertInfo)> {
        return self.ready_deploy_nft
            .iter()
            .collect();
    }

    /************/
    /*  Utils   */
    /************/
    fn generate_cert_key(&self, user: ValidAccountId, issuer: AccountId) -> String {
        return [String::from(user), issuer].join("_");
    }

    fn create_meta_data(&self) -> TokenMetadata {
        TokenMetadata {
            title: Some(("First certificate").into()),
            description: Some("The tallest mountain in the charted solar system".into()),
            media: None,
            media_hash: None,
            copies: Some(1u64),
            issued_at: None,
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        }
    }
        
    /************/
    /* Internal */
    /************/
    
    fn assert_called_by_foundation(&self) {
        assert_eq!(
            &env::predecessor_account_id(),
            &self.owner,
            "Can only be called by NEAR Foundation"
        );
    }
    
    fn assert_called_by_issuers(&self) {
        assert!(
            self.issuers.get(&env::predecessor_account_id()).is_some(),
            "Only call by issuers"
        );
    }
}
near_contract_standards::impl_non_fungible_token_core!(SmartCertificateContract, nft_token);
near_contract_standards::impl_non_fungible_token_approval!(SmartCertificateContract, nft_token);
near_contract_standards::impl_non_fungible_token_enumeration!(SmartCertificateContract, nft_token);

#[near_bindgen]
impl NonFungibleTokenMetadataProvider for SmartCertificateContract {
    fn nft_metadata(&self) -> NFTContractMetadata {
        self.metadata.get().unwrap()
    }
}



