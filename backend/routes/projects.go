package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func ProjectsRouter(router *gin.Engine) {
	r := router.Group("/api/projects")
	{
		r.Use(middleware.AuthMiddleware())

		r.POST("/register", controllers.RegisterMoldProject)
		r.POST("/create_steps", controllers.RegisterSteps)
		r.GET("/", controllers.ListMoldProjects)
		r.GET("/components", controllers.ListMoldComponents)
		r.GET("/processes", controllers.ListMoldProcesses)
	}
}
