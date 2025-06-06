package controllers

import (
	"net/http"
	"strconv"

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

func RegisterNewComponentsAndProcesses(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project mold code is required"})
		return
	}

	var request contracts.CreateComponentsAndProcessesRequest
	if err := c.ShouldBindJSON(&request); err != nil {
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

	if err := usecases.CreateMoldComponentsAndProcesses(moldsRepo, componentsRepo, processRepo, request, moldCode); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering updates: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "New components and processes added successfully",
	})
}

func ListMoldProjects(c *gin.Context) {
	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}

	limit, offset := getPaginationParams(c)
	status := c.Query("status")

	molds, total, err := usecases.ListMoldsByStatus(moldsRepo, status, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing molds: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"molds": molds,
		"total": total,
	})
}

func ListMoldComponents(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mold code is required"})
		return
	}
	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	limit, offset := getPaginationParams(c)

	components, total, err := usecases.ListComponentsByMold(componentsRepo, moldCode, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing components: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"components": components,
		"total":      total,
	})
}

func ListActiveComponentsWithActiveProcesses(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mold code is required"})
		return
	}

	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	components, err := usecases.ListActiveComponentsWithActiveProcessByMold(componentsRepo, moldCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"components": components,
		"count":      len(components),
	})
}

func UpdateMoldOperation(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mold code is required"})
		return
	}

	var project contracts.UpdateMoldOperationRequest
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	if err := usecases.UpdateMoldOperation(moldsRepo, componentsRepo, processRepo, project, moldCode); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating project: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mold project updated successfully",
	})
}

func DeleteMoldProject(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Mold ID is required"})
		return
	}

	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}

	if err := usecases.SoftDeleteMold(moldsRepo, moldCode); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting mold project: " + err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{"message": "Mold deleted succesfully"})
}

func DeleteComponent(c *gin.Context) {
	componentID := c.Param("componentID")
	moldCode := c.Query("moldCode") // supondo que você envie o molde no query param (pode ajustar aqui)

	if componentID == "" || moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Component ID and Mold Code are required"})
		return
	}

	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	// Agora precisa também dos outros repos para criar MoldService
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}

	// Criar o MoldService
	moldService := usecases.NewMoldService(moldsRepo, componentsRepo, processRepo)

	// Agora sim, chamar o método correto
	if err := moldService.SoftDeleteComponents(componentID, moldCode); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting component: " + err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{"message": "Component deleted successfully"})
}

func ListInactiveMoldProjects(c *gin.Context) {
	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}

	limit, offset := getPaginationParams(c)

	molds, total, err := usecases.ListInactiveMolds(moldsRepo, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing inactive molds: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"molds": molds,
		"total": total,
	})
}

func ListInactiveComponentsByMold(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "moldCode is required"})
		return
	}
	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	limit, offset := getPaginationParams(c)

	components, total, err := usecases.ListInactiveComponents(componentsRepo, moldCode, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing inactive components: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"components": components,
		"total":      total,
	})
}

func getPaginationParams(c *gin.Context) (int, int) {
	limit := 10 // Valor padrão
	offset := 0 // Valor padrão

	// Obtém o parâmetro "limit" da query string
	if l := c.Param("limit"); l != "" {
		if parsedLimit, err := strconv.Atoi(l); err == nil {
			limit = parsedLimit
		}
	}

	// Obtém o parâmetro "offset" da query string
	if o := c.Param("offset"); o != "" {
		if parsedOffset, err := strconv.Atoi(o); err == nil {
			offset = parsedOffset
		}
	}

	return limit, offset
}
