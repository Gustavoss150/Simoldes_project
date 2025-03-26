package main

import (
	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/migrations"
	"github.com/Gustavoss150/simoldes-backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDatabase()
	migrations.Migrate()

	r := gin.Default()

	routes.AuthRoutes(r)

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "API working"})
	})
	r.Run(":9000")
}
