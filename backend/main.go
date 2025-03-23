package main

import (
	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "API working"})
	})
	r.Run(":9000")
}
