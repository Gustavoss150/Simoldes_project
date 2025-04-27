package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func MaterialsRouter(router *gin.Engine) {
	r := router.Group("/api/materials")
	{
		r.Use(middleware.AuthMiddleware())

		r.POST("/", controllers.RegisterMaterial)
	}
}
