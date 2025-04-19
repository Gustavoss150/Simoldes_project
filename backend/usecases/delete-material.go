package usecases

import (
	"errors"

	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
)

func SoftDeleteMaterial(materialsRepo materialsrepo.MaterialsRepository, id string) error {
	material, err := materialsRepo.GetAcoByID(id)
	if err != nil {
		return err
	}

	if !material.IsActive {
		return errors.New("material is already inactive")
	}

	material.IsActive = false
	return materialsRepo.Save(material)
}
