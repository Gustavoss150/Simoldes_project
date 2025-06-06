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

		r.POST("/mach", controllers.RegisterMachine)
		r.POST("/program/:moldCode", controllers.RegisterProgram)
		r.GET("/mach/:machineID", controllers.GetMachine)
		r.GET("/mach", controllers.ListMachines)
		r.GET("/program/mold/:moldCode", controllers.ListProgrammingByMold)
		r.GET("/program/:componentID", controllers.ListProgrammingByComponent)
		r.PUT("/mach/:machineID", controllers.UpdateMachine)
		r.PUT("/program/:programID", controllers.UpdateCNCProgram)
		r.DELETE("/mach/:machineID", controllers.DeleteMachine)
		r.DELETE("/program/:programID", controllers.DeleteProgram)
	}
}
