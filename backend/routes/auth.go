package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/login", controllers.LoginHandler)

	return r
}
