package controllers

import (
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/models"
	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
	"github.com/Gustavoss150/simoldes-backend/usecases"
	"github.com/gin-gonic/gin"
)

func RegisterMaterial(c *gin.Context) {
	var material models.ChegadaAcos
	if err := c.ShouldBindJSON(&material); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}

	if err := usecases.CreateMaterial(materialsRepo, &material); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering material: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"material": material, "message": "Material registered successfully"})
}
