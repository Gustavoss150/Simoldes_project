package usecases

import (
	"errors"
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
)

func CreateMaterial(materialsRepo materialsrepo.MaterialsRepository, componentsRepo componentsrepo.ComponentsRepository, aco *models.ChegadaAcos) error {
	if aco.ID == "" || aco.MoldeCodigo == "" || aco.ComponentesID == "" {
		return errors.New("required fields are missing")
	}

	component, err := componentsRepo.GetByID(aco.ComponentesID)
	if err != nil {
		return fmt.Errorf("error checking component existence: %w", err)
	}
	if component == nil {
		return fmt.Errorf("component with ID %s does not exist", aco.ComponentesID)
	}

	// Verificando se o componente corresponde ao molde
	if component.MoldeCodigo != aco.MoldeCodigo {
		return fmt.Errorf("component with ID %s does not belong to mold %s", aco.ComponentesID, aco.MoldeCodigo)
	}

	existing, _ := materialsRepo.GetAcoByID(aco.ID)
	if existing != nil {
		return fmt.Errorf("material with ID %s already exists", aco.ID)
	}

	aco.IsArrived = false
	aco.IsActive = true

	return materialsRepo.Save(aco)
}
