mod crypto;

use std::{env, net::SocketAddr, sync::Arc};

use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use crypto::VaultCrypto;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tower_http::cors::{Any, CorsLayer};

#[derive(Clone)]
struct AppState {
    vault: Arc<VaultCrypto>,
}

#[derive(Debug, Deserialize)]
struct EnvelopeRequest {
    kind: String,
    payload: Value,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct EnvelopeResponse {
    envelope_id: String,
    algorithm: String,
    storage_status: String,
    cipher_preview: String,
    sealed_at: String,
    nonce: String,
    ciphertext: String,
}

#[derive(Debug, Deserialize)]
struct DecryptRequest {
    kind: String,
    nonce: String,
    ciphertext: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct DecryptResponse {
    payload: Value,
}

#[derive(Debug, Serialize)]
struct HealthResponse {
    status: &'static str,
    algorithm: &'static str,
}

#[derive(Debug, Serialize)]
struct ErrorResponse {
    error: String,
}

#[derive(Debug)]
struct AppError {
    status: StatusCode,
    message: String,
}

impl AppError {
    fn bad_request(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            message: message.into(),
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            self.status,
            Json(ErrorResponse {
                error: self.message,
            }),
        )
            .into_response()
    }
}

#[tokio::main]
async fn main() {
    let port = env::var("VAULT_API_PORT").unwrap_or_else(|_| "8090".to_string());
    let address: SocketAddr = format!("0.0.0.0:{port}")
        .parse()
        .expect("valid socket address");

    let app_state = AppState {
        vault: Arc::new(VaultCrypto::from_env()),
    };

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/v1/envelopes", post(create_envelope))
        .route("/api/v1/decrypt", post(decrypt_envelope))
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind(address)
        .await
        .expect("listener should bind");

    axum::serve(listener, app)
        .await
        .expect("vault server should stay available");
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok",
        algorithm: "AES-256-GCM",
    })
}

async fn create_envelope(
    State(state): State<AppState>,
    Json(request): Json<EnvelopeRequest>,
) -> Result<Json<EnvelopeResponse>, AppError> {
    let sealed = state.vault.encrypt_value(&request.kind, &request.payload)?;

    Ok(Json(EnvelopeResponse {
        envelope_id: sealed.envelope_id,
        algorithm: "AES-256-GCM".to_string(),
        storage_status: "Encrypted and staged".to_string(),
        cipher_preview: sealed.cipher_preview,
        sealed_at: sealed.sealed_at,
        nonce: sealed.nonce,
        ciphertext: sealed.ciphertext,
    }))
}

async fn decrypt_envelope(
    State(state): State<AppState>,
    Json(request): Json<DecryptRequest>,
) -> Result<Json<DecryptResponse>, AppError> {
    let payload =
        state
            .vault
            .decrypt_value(&request.kind, &request.nonce, &request.ciphertext)?;

    Ok(Json(DecryptResponse { payload }))
}
