package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
)

func UpdateMaterial(materialsRepo materialsrepo.MaterialsRepository, req contracts.UpdateMaterialRequest, id string) error {
	material, err := materialsRepo.GetAcoByID(id)
	if err != nil || material == nil {
		return errors.New("material not found")
	}

	if req.Type != nil {
		material.Type = *req.Type
	}
	if req.Quantity != nil {
		material.Quantity = *req.Quantity
	}
	if req.ArrivalDate != nil {
		material.ArrivalDate = *req.ArrivalDate
	}
	if req.IsArrived != nil {
		material.IsArrived = *req.IsArrived
	}
	if req.Supplier != nil {
		material.Supplier = *req.Supplier
	}

	if err = materialsRepo.Save(material); err != nil {
		return errors.New("error updating material")
	}

	return nil
}
