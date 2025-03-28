package server

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func InitCORS(router *gin.Engine) {
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},                   // URL do front-end
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},            // Métodos permitidos
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Cabeçalhos permitidos
		AllowCredentials: true,                                                // Permitir envio de cookies e credenciais
	}))
}
