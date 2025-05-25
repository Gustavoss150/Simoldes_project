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

func ResgisterProcessesToComponent(c *gin.Context) {
	componentID := c.Param("componentID")

	var dto contracts.AddProcessToComponentDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}

	if err := usecases.CreateProcessesToComponent(componentID, processRepo, componentsRepo, moldsRepo, dto); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Processes added successfully"})
}

func ListMoldProcesses(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "moldCode is required"})
		return
	}
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	processes, err := usecases.ListProcessesWithStepsByMold(processRepo, moldCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing processes: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"processes": processes,
	})
}

func ListProcessesByComponent(c *gin.Context) {
	componentID := c.Param("componentID")
	if componentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "componentID is required"})
		return
	}
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	processes, err := usecases.ListStepsByComponent(processRepo, componentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing processes: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"processes": processes,
	})
}

func ListAllSteps(c *gin.Context) {
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	steps, total, err := usecases.ListAllSteps(processRepo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing steps: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"steps": steps,
		"total": total,
	})
}

func ListInactiveSteps(c *gin.Context) {
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	inactiveSteps, err := usecases.ListAllInactiveSteps(processRepo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing inactive steps: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"inactive_steps": inactiveSteps,
	})
}

func ListInactiveProcessesByMold(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "moldCode is required"})
		return
	}
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	inactiveProcesses, err := usecases.ListInactiveProcessesByMold(processRepo, moldCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing inactive processes: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"inactive_processes": inactiveProcesses,
	})
}

func UpdateSteps(c *gin.Context) {
	stepID := c.Param("stepID")
	if stepID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Step ID is required"})
		return
	}

	var step contracts.UpdateStepsRequest
	if err := c.ShouldBindJSON(&step); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing processes repository: " + err.Error()})
		return
	}

	if err := usecases.UpdateSteps(processRepo, step, stepID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating step: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, step)
}

func DeleteProcess(c *gin.Context) {
	processID := c.Param("processID")
	moldCode := c.Query("moldCode") // moldCode vem pela query string

	if processID == "" || moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Process ID and Mold Code are required"})
		return
	}

	// Inicializar repositórios
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

	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}

	// Criar o MoldService
	moldService := usecases.NewMoldService(moldsRepo, componentsRepo, processRepo)

	if err := moldService.SoftDeleteProcess(processID, moldCode); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting process: " + err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{"message": "Process deleted successfully"})
}

func DeleteStep(c *gin.Context) {
	stepID := c.Param("stepID")
	if stepID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Step ID is required"})
		return
	}

	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing processes database: " + err.Error()})
		return
	}

	if err := usecases.SoftDeleteStep(processRepo, stepID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting step: " + err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{"message": "Step deleted successfully"})
}
