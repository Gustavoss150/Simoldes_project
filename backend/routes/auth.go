package routes

import (
	"simoldes-project/backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/login", controllers.Login)
}
