package vault

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/store"
)

type Client struct {
	baseURL string
	http    *http.Client
}

type envelopeRequest struct {
	Kind    string `json:"kind"`
	Payload any    `json:"payload"`
}

type envelopeResponse struct {
	StorageStatus string `json:"storageStatus"`
	CipherPreview string `json:"cipherPreview"`
}

func NewClient() *Client {
	baseURL := os.Getenv("VAULT_API_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8090"
	}

	return &Client{
		baseURL: baseURL,
		http: &http.Client{
			Timeout: 3 * time.Second,
		},
	}
}

func (c *Client) SealRecord(ctx context.Context, kind string, payload any) store.VaultResult {
	body, err := json.Marshal(envelopeRequest{
		Kind:    kind,
		Payload: payload,
	})
	if err != nil {
		return fallback(kind)
	}

	request, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		fmt.Sprintf("%s/api/v1/envelopes", c.baseURL),
		bytes.NewReader(body),
	)
	if err != nil {
		return fallback(kind)
	}
	request.Header.Set("Content-Type", "application/json")

	response, err := c.http.Do(request)
	if err != nil || response.StatusCode >= http.StatusBadRequest {
		return fallback(kind)
	}
	defer response.Body.Close()

	var payloadResponse envelopeResponse
	if err := json.NewDecoder(response.Body).Decode(&payloadResponse); err != nil {
		return fallback(kind)
	}

	return store.VaultResult{
		Status:        payloadResponse.StorageStatus,
		CipherPreview: payloadResponse.CipherPreview,
	}
}

func fallback(kind string) store.VaultResult {
	return store.VaultResult{
		Status:        fmt.Sprintf("Vault fallback seal (%s)", kind),
		CipherPreview: fmt.Sprintf("mock_cipher[%s]:4a61736f6e2d7365616c6564", kind),
	}
}

