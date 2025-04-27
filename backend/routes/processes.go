package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func ProcessesRouter(router *gin.Engine) {
	r := router.Group("/api/processes")
	{
		r.Use(middleware.AuthMiddleware())

		r.POST("/register_steps", controllers.RegisterSteps)
		r.GET("/:moldCode", controllers.ListMoldProcesses)
		r.GET("/components/:componentID", controllers.ListProcessesByComponent)
		r.GET("/steps", controllers.ListAllSteps)
		r.GET("/inactive_steps", controllers.ListInactiveSteps)
		r.GET("/inactive_processes/:moldCode", controllers.ListInactiveProcessesByMold)
		r.PUT("/:stepID", controllers.UpdateSteps)
		r.DELETE("/:processID", controllers.DeleteProcess) // ex: /processes/{processID}?moldCode={codigo}
		r.DELETE("/steps/:stepID", controllers.DeleteStep)
	}
}
