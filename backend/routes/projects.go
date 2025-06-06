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

		r.POST("/", controllers.RegisterMoldProject)
		r.POST("/new/:moldCode", controllers.RegisterNewComponentsAndProcesses)
		r.GET("/", controllers.ListMoldProjects)
		r.GET("/components/:moldCode", controllers.ListMoldComponents)
		r.GET("/components/processes/:moldCode", controllers.ListActiveComponentsWithActiveProcesses)
		r.PUT("/:moldCode", controllers.UpdateMoldOperation)
		r.DELETE("/:moldCode", controllers.DeleteMoldProject)
		r.DELETE("/components/:componentID", controllers.DeleteComponent)
		r.GET("/inactive_projects", controllers.ListInactiveMoldProjects)
		r.GET("/inactive_components/:moldCode", controllers.ListInactiveComponentsByMold)
	}
}
