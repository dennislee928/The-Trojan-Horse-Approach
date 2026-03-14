package api

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/model"
	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/store"
	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/vault"
)

type Server struct {
	store *store.Store
	vault *vault.Client
}

func New(store *store.Store, vaultClient *vault.Client) *gin.Engine {
	server := &Server{
		store: store,
		vault: vaultClient,
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))

	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := router.Group("/api")
	api.GET("/dashboard", server.dashboard)
	api.POST("/digital-will/plans", server.createWillPlan)
	api.POST("/subscriptions/scan", server.scanSubscriptions)
	api.POST("/dead-man-switch/check-in", server.checkIn)
	api.GET("/capsules", server.listCapsules)
	api.POST("/capsules", server.createCapsule)

	return router
}

func (s *Server) dashboard(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, s.store.Dashboard())
}

func (s *Server) createWillPlan(ctx *gin.Context) {
	var request model.DigitalWillRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := s.vault.SealRecord(ctx.Request.Context(), "digital_will", request)
	ctx.JSON(http.StatusOK, s.store.BuildWillPlan(request, result))
}

func (s *Server) scanSubscriptions(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, s.store.RunSubscriptionScan())
}

func (s *Server) checkIn(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, s.store.CheckInNow())
}

func (s *Server) listCapsules(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, s.store.Capsules())
}

func (s *Server) createCapsule(ctx *gin.Context) {
	var request model.CapsuleRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := s.vault.SealRecord(ctx.Request.Context(), "time_capsule", request)
	ctx.JSON(http.StatusOK, s.store.CreateCapsule(request, result))
}
