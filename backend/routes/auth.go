package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRouter(router *gin.Engine) {
	r := router.Group("/api/auth")
	{
		r.POST("/register", controllers.RegisterUser)
		r.POST("/login", controllers.LoginUser)
	}
}
