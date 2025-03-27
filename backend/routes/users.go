package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func UserRouter(r *gin.Engine) *gin.Engine {
	r.Use(middleware.AuthMiddleware()) // Aplica o middleware de autenticação
	{
		r.PUT("/users/:id", controllers.UpdateUser)
	}
	return r
}
