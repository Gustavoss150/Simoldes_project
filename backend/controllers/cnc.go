package controllers

import (
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/contracts"
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
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

func RegisterProgram(c *gin.Context) {
	var prog models.Programacoes
	if err := c.ShouldBindJSON(&prog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "moldCode is required"})
		return
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
		return
	}

	if err := usecases.CreateProgramming(cncRepo, prog, moldCode); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering prog: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"program": prog,
		"message": "Program created successfully",
	})
}

func GetMachine(c *gin.Context) {
	machineID := c.Param("machineID")
	if machineID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "machineID is required"})
		return
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
		return
	}

	machine, err := cncRepo.GetMachByID(machineID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching machine: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"machine": machine,
	})
}

func ListMachines(c *gin.Context) {
	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
		return
	}

	machines, err := usecases.ListMach(cncRepo, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching machines: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"machines": machines})
}

func ListProgramming(c *gin.Context) {
	compID := c.Param("componentID")
	if compID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "component ID is required"})
		return
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
	}

	progs, err := usecases.ListProgrammingByComponent(cncRepo, compID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching scripts: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"CNC Programs": progs})
}

func UpdateMachine(c *gin.Context) {
	machineID := c.Param("machineID")
	if machineID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "machineID is required"})
		return
	}

	var mach contracts.UpdateMachRequest
	if err := c.ShouldBindJSON(&mach); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
		return
	}

	if err := usecases.UpdateMach(cncRepo, mach, machineID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating machine: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"machine": mach})
}

func UpdateCNCProgram(c *gin.Context) {
	programID := c.Param("programID")
	if programID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Programming ID is required"})
	}

	var prog contracts.UpdateCNCProgramming
	if err := c.BindJSON(&prog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Request: " + err.Error()})
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
		return
	}

	if err := usecases.UpdateProgramming(cncRepo, prog, programID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating CNC programming: " + err.Error()})
	}

	c.JSON(http.StatusCreated, gin.H{"program": prog})
}

func DeleteMachine(c *gin.Context) {
	machineID := c.Param("machineID")
	if machineID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "machineID is required"})
		return
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing cnc database: " + err.Error()})
		return
	}

	if err := usecases.SoftDeleteMach(cncRepo, machineID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting machine: " + err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{"message": "Machine deleted successfully"})
}

func DeleteProgram(c *gin.Context) {
	programID := c.Param("programID")
	if programID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "programID is required"})
		return
	}

	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
		return
	}

	if err := usecases.SoftDeleteCNCProgramming(cncRepo, programID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting CNC programming: " + err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{"message": "CNC programming deleted successfully"})
}
