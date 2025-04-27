package controllers

import (
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
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

	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}

	if err := usecases.CreateMaterial(materialsRepo, componentsRepo, &material); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering material: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"material": material, "message": "Material registered successfully"})
}

func ListMaterialsByMold(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mold code is required"})
		return
	}

	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}

	materials, err := usecases.ListMaterialsByMold(materialsRepo, moldCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing materials: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"materials": materials})
}

func ListMaterialsByComponent(c *gin.Context) {
	componentID := c.Param("componentID")
	if componentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "component ID is required"})
		return
	}

	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}

	materials, err := usecases.ListMaterialsByComponent(materialsRepo, componentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing materials: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"materials": materials})
}

func ListArrivedMaterialsByMold(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mold code is required"})
		return
	}

	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}

	materials, err := usecases.ListArrivedMaterials(materialsRepo, moldCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing materials: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Arrived materials": materials})
}

func ListPendingMaterialsByMold(c *gin.Context) {
	moldCode := c.Param("moldCode")
	if moldCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "mold code is required"})
		return
	}

	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}

	materials, err := usecases.ListPendingMaterials(materialsRepo, moldCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error listing materials: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Pending materials": materials})
}

func UpdateMaterial(c *gin.Context) {
	materialID := c.Param("materialID")
	if materialID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "material ID is required"})
		return
	}

	var material contracts.UpdateMaterialRequest
	if err := c.ShouldBindJSON(&material); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}

	if err := usecases.UpdateMaterial(materialsRepo, material, materialID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating material: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Material updated successfully"})
}

func DeleteMaterial(c *gin.Context) {
	materialID := c.Param("materialID")
	if materialID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Material ID is required"})
		return
	}

	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}

	if err := usecases.SoftDeleteMaterial(materialsRepo, materialID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting material: " + err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{"message": "Material deleted succesfully"})
}
