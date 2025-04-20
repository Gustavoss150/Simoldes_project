package controllers

import (
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	"github.com/Gustavoss150/simoldes-backend/usecases"
	"github.com/gin-gonic/gin"
)

func RegisterMoldProject(c *gin.Context) {
	var project contracts.CreateMoldProjectRequest
	// Faz o bind do JSON recebido para a estrutura CreateMoldProjectRequest
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}
	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing processes database: " + err.Error()})
		return
	}

	if err := usecases.CreateMoldProject(moldsRepo, componentsRepo, processRepo, project); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering project: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"project": project,
		"message": "Mold project created successfully",
	})
}

func RegisterSteps(c *gin.Context) {
	var steps []contracts.CreateStepRequest

	if err := c.BindJSON(&steps); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
	}

	if err := usecases.CreateManySteps(processRepo, steps); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering steps: " + err.Error()})
	}

	c.JSON(http.StatusCreated, steps)
}
