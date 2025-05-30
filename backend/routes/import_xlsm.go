package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func ImportRouter(router *gin.Engine) {
	r := router.Group("/api/import")
	{
		r.Use(middleware.AuthMiddleware())

		r.POST("/all", controllers.ImportAll)
	}
}
