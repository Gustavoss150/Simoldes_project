package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func UserRouter(router *gin.Engine) {
	r := router.Group("/api/users")
	{
		r.Use(middleware.AuthMiddleware()) // Aplica o middleware de autenticação

		r.PUT("/:id", controllers.UpdateUser)
	}
}
