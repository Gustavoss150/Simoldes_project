package controllers

import (
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/models"
	cncrepo "github.com/Gustavoss150/simoldes-backend/repositories/cnc_repository"
	"github.com/Gustavoss150/simoldes-backend/usecases"
	"github.com/gin-gonic/gin"
)

func RegisterMachine(c *gin.Context) {
	var mach models.Maquinas
	if err := c.ShouldBindJSON(&mach); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing cnc database: " + err.Error()})
		return
	}

	if err := usecases.CreateMach(cncRepo, mach); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering mach: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"machine": mach,
		"message": "Machine created successfully",
	})
}
