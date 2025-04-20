package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func CNCRouter(router *gin.Engine) {
	r := router.Group("/api/cnc")
	{
		r.Use(middleware.AuthMiddleware())

		r.POST("/register_mach", controllers.RegisterMachine)

	}
}
