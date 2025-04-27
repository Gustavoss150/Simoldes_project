package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/Gustavoss150/simoldes-backend/routes/middleware"
	"github.com/gin-gonic/gin"
)

func MaterialsRouter(router *gin.Engine) {
	r := router.Group("/api/materials")
	{
		r.Use(middleware.AuthMiddleware())

		r.POST("/", controllers.RegisterMaterial)
		r.GET("/:moldCode", controllers.ListMaterialsByMold)
		r.GET("/components/:componentID", controllers.ListMaterialsByComponent)
		r.GET("/arrived/:moldCode", controllers.ListArrivedMaterialsByMold)
		r.GET("/pending/:moldCode", controllers.ListPendingMaterialsByMold)
		r.PUT("/:materialID", controllers.UpdateMaterial)
		r.DELETE("/:materialID", controllers.DeleteMaterial)
	}
}
