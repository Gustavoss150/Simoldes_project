package main

import (
	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/migrations"
	"github.com/Gustavoss150/simoldes-backend/server"
	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDatabase()
	migrations.Migrate()

	r := gin.Default()

	server.InitRoutes(r)

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "API working"})
	})
	r.Run(":9000")
}
