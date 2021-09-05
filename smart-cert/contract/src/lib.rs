use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc, AccountId };
use std::collections::{HashMap};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Deserialize, Serialize};

// setup_alloc!();
#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

// Define Model
// #[near_bindgen]
// #[derive(Copy, Clone)]
#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct UserInfo {
    pub name: String,
    pub dob: String,
    pub national_id: String,
    pub from: Issuer, 
}


// #[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct CertInfo {
    pub user_info: UserInfo,
    pub is_first_approved: bool,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct SmartCertificateContract{
    owner: AccountId, //Owners of this contract, the only person can add more issuers
    issuers: UnorderedMap<AccountId, Issuer>, //List of issuers, only issuers in this list can create a cert
    need_user_approved: HashMap<AccountId, CertInfo>, 
    ready_deploy_nft: HashMap<AccountId, CertInfo> 
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

#[near_bindgen]
impl SmartCertificateContract {
    #[init]
    pub fn new() -> Self {
        assert!(!env::state_exists(), "The contract is already initialized");
        assert!(
            env::is_valid_account_id(env::predecessor_account_id().as_bytes()),
            "The NEAR Foundation account ID is invalid"
        );

        SmartCertificateContract {
            owner: env::predecessor_account_id(),
            issuers: UnorderedMap::new(b"i".to_vec()),
            need_user_approved: HashMap::new(),
            ready_deploy_nft: HashMap::new(),
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

    pub fn create_cert(&mut self, user_account_id: AccountId, name: String, dob: String, national_id: String) {
        assert!(
            env::is_valid_account_id(user_account_id.as_bytes()),
            "The given account ID is invalid"
        );

        self.assert_called_by_issuers();
        // let issuers = std::mem::take(&mut self.issuers);
        let issuer = self.issuers.get(&env::predecessor_account_id()).clone().unwrap();
        let user = UserInfo {
            name: name,
            dob: dob,
            national_id: national_id,
            from: issuer.clone() 
        };

        let cert_info = CertInfo {
            user_info: user,
            is_first_approved: false
        };

        self.need_user_approved.insert(user_account_id, cert_info);
    }

    pub fn user_approved(&mut self) {

        let cert = self.need_user_approved.get(&env::predecessor_account_id()).clone().unwrap();
        let new_cert = CertInfo {
            user_info: cert.user_info.clone(),
            is_first_approved: true
        };
        self.need_user_approved.remove(&env::predecessor_account_id());
        self.ready_deploy_nft.insert(env::predecessor_account_id(), new_cert);
    }

    // Issuer deploy cert as a NFT and return NFT address
    //pub fn deployNFTCert() -> String {
    //    //Issue an NFT by issuers
    //    let string = "hello";
    //    return *string;
    //}

    //User will receive a address of nft cert. User check their information. And then approve NFT.
    pub fn approve_nft_cert_by_user() -> bool {
        return true;

    } 
   
    // Issuer will finalize cert and this cert is legal.
    // pub fn finallize() -> bool {

    // }

    // Allow third party user can check the cert.
    // pub fn checkCert() -> bool {

    // }

    pub fn get_issuers(&self) -> Vec<(AccountId, Issuer)> {
        return self.issuers.to_vec();
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



