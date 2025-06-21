package usecases

import (
	"time"

	"github.com/Gustavoss150/simoldes-backend/models"
	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
)

func ListMaterialsByMold(materialsRepo materialsrepo.MaterialsRepository, moldCode string) ([]*models.ChegadaAcos, error) {
	return materialsRepo.GetAcosByMold(moldCode)
}

func ListMaterialsByComponent(materialsRepo materialsrepo.MaterialsRepository, componentID string) ([]*models.ChegadaAcos, error) {
	return materialsRepo.GetAcoByComponent(componentID)
}

func ListArrivedMaterials(materialsRepo materialsrepo.MaterialsRepository, moldCode string) ([]*models.ChegadaAcos, error) {
	all, err := materialsRepo.GetAcosByMold(moldCode)
	if err != nil {
		return nil, err
	}

	var result []*models.ChegadaAcos
	for _, m := range all {
		if m.IsArrived {
			result = append(result, m)
		}
	}
	return result, nil
}

func ListPendingMaterials(materialsRepo materialsrepo.MaterialsRepository, moldCode string) ([]*models.ChegadaAcos, error) {
	all, err := materialsRepo.GetAcosByMold(moldCode)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	var result []*models.ChegadaAcos
	for _, m := range all {
		if !m.IsArrived && m.ArrivalDate.Before(now) {
			result = append(result, m)
		}
	}
	return result, nil
}

func ListInactiveMaterials(materialsRepo materialsrepo.MaterialsRepository, moldCode string) ([]*models.ChegadaAcos, error) {
	return materialsRepo.GetInactiveByMold(moldCode)
}
