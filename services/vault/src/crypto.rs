use std::env;

use aes_gcm::{
    Aes256Gcm, KeyInit, Nonce,
    aead::{Aead, Payload},
};
use base64::{Engine as _, engine::general_purpose::STANDARD};
use chrono::Utc;
use rand::RngCore;
use serde_json::Value;
use uuid::Uuid;

use crate::AppError;

#[derive(Debug)]
pub struct SealedEnvelope {
    pub envelope_id: String,
    pub cipher_preview: String,
    pub sealed_at: String,
    pub nonce: String,
    pub ciphertext: String,
}

#[derive(Clone)]
pub struct VaultCrypto {
    cipher: Aes256Gcm,
}

impl VaultCrypto {
    pub fn from_env() -> Self {
        let key = load_key();
        let cipher = Aes256Gcm::new_from_slice(&key).expect("32-byte key should be valid");
        Self { cipher }
    }

    pub fn encrypt_value(&self, kind: &str, value: &Value) -> Result<SealedEnvelope, AppError> {
        let plaintext = serde_json::to_vec(value)
            .map_err(|_| AppError::bad_request("payload could not be serialized"))?;

        let mut nonce_bytes = [0_u8; 12];
        rand::rng().fill_bytes(&mut nonce_bytes);

        let ciphertext = self
            .cipher
            .encrypt(
                Nonce::from_slice(&nonce_bytes),
                Payload {
                    msg: &plaintext,
                    aad: kind.as_bytes(),
                },
            )
            .map_err(|_| AppError::bad_request("payload could not be encrypted"))?;

        let ciphertext_b64 = STANDARD.encode(ciphertext);
        Ok(SealedEnvelope {
            envelope_id: format!("env_{}", &Uuid::new_v4().to_string()[..8]),
            cipher_preview: format!("{}...", &ciphertext_b64[..ciphertext_b64.len().min(24)]),
            sealed_at: Utc::now().to_rfc3339(),
            nonce: STANDARD.encode(nonce_bytes),
            ciphertext: ciphertext_b64,
        })
    }

    pub fn decrypt_value(
        &self,
        kind: &str,
        nonce: &str,
        ciphertext: &str,
    ) -> Result<Value, AppError> {
        let nonce_bytes = STANDARD
            .decode(nonce)
            .map_err(|_| AppError::bad_request("nonce is not valid base64"))?;
        let ciphertext_bytes = STANDARD
            .decode(ciphertext)
            .map_err(|_| AppError::bad_request("ciphertext is not valid base64"))?;

        if nonce_bytes.len() != 12 {
            return Err(AppError::bad_request("nonce must decode to 12 bytes"));
        }

        let plaintext = self
            .cipher
            .decrypt(
                Nonce::from_slice(&nonce_bytes),
                Payload {
                    msg: &ciphertext_bytes,
                    aad: kind.as_bytes(),
                },
            )
            .map_err(|_| AppError::bad_request("ciphertext could not be decrypted"))?;

        serde_json::from_slice(&plaintext)
            .map_err(|_| AppError::bad_request("decrypted payload is not valid JSON"))
    }
}

fn load_key() -> [u8; 32] {
    let raw = env::var("VAULT_MASTER_KEY")
        .unwrap_or_else(|_| "trojan-horse-vault-dev-master-key-0123".to_string());

    if raw.len() == 64 {
        if let Ok(decoded) = hex::decode(&raw) {
            if decoded.len() == 32 {
                let mut key = [0_u8; 32];
                key.copy_from_slice(&decoded);
                return key;
            }
        }
    }

    let bytes = raw.as_bytes();
    let mut key = [0_u8; 32];
    let count = bytes.len().min(32);
    key[..count].copy_from_slice(&bytes[..count]);
    key
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::VaultCrypto;

    #[test]
    fn encrypts_and_decrypts_roundtrip() {
        let vault = VaultCrypto::from_env();
        let original = json!({
            "title": "A note for later",
            "recipient": "Kai",
            "message": "Hello from the vault",
        });

        let sealed = vault
            .encrypt_value("time_capsule", &original)
            .expect("encryption should succeed");
        let decrypted = vault
            .decrypt_value("time_capsule", &sealed.nonce, &sealed.ciphertext)
            .expect("decryption should succeed");

        assert_eq!(decrypted, original);
    }
}
