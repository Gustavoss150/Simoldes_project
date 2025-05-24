package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func UploadRouter(router *gin.Engine) {
	r := router.Group("/api/upload")
	{
		r.Use(middleware.AuthMiddleware())

		r.POST("/model3d", controllers.Upload3DModel)
		r.POST("/scriptnc", controllers.UploadNC)
	}
}
