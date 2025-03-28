package server

import (
	"github.com/Gustavoss150/simoldes-backend/routes"
	"github.com/gin-gonic/gin"
)

// Função que inicializa todas as rotas do servidor
func InitRoutes(router *gin.Engine) {

	InitCORS(router)

	routes.AuthRouter(router)
	routes.UserRouter(router)

	router.GET("/api", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "API working"})
	})
}
