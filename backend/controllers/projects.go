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

func ListMoldProjects(c *gin.Context) {
	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}

	limit, offset := getPaginationParams(c)

	molds, total, err := usecases.ListAllMolds(moldsRepo, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing molds: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"molds": molds,
		"total": total,
	})
}

// NECESSITA DE AJUSTES NO PARÂMETRO
func ListMoldComponents(c *gin.Context) {
	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	moldCode := c.Query("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "moldCode is required"})
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

// NECESSITA DE AJUSTES NO PARÂMETRO
func ListMoldProcesses(c *gin.Context) {
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing process database: " + err.Error()})
		return
	}

	moldCode := c.Query("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "moldCode is required"})
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

func getPaginationParams(c *gin.Context) (int, int) {
	limit := 10 // Valor padrão
	offset := 0 // Valor padrão

	// Obtém o parâmetro "limit" da query string
	if l := c.Query("limit"); l != "" {
		if parsedLimit, err := strconv.Atoi(l); err == nil {
			limit = parsedLimit
		}
	}

	// Obtém o parâmetro "offset" da query string
	if o := c.Query("offset"); o != "" {
		if parsedOffset, err := strconv.Atoi(o); err == nil {
			offset = parsedOffset
		}
	}

	return limit, offset
}
