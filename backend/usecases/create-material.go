package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/models"
	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
)

func CreateMaterial(materialsRepo materialsrepo.MaterialsRepository, aco *models.ChegadaAcos) error {
	if aco.ID == "" || aco.MoldeCodigo == "" || aco.ComponentesID == "" {
		return errors.New("required fields are missing")
	}

	// Ao criar, o material ainda não chegou
	aco.IsArrived = false
	aco.IsActive = true

	return materialsRepo.Save(aco)
}
