package main

import (
	"log"
	"os"

	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/api"
	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/store"
	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/vault"
)

func main() {
	port := os.Getenv("CORE_API_PORT")
	if port == "" {
		port = "8080"
	}

	server := api.New(store.New(), vault.NewClient())
	if err := server.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
