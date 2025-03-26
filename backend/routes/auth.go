package routes

import (
	"github.com/Gustavoss150/simoldes-backend/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/register", controllers.RegisterUser)
	r.POST("/login", controllers.LoginUser)

	return r
}
