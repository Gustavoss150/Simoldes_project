package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
)

func ListActiveComponentsWithActiveProcessByMold(
	componentsRepo componentsrepo.ComponentsRepository,
	moldCode string,
) ([]*models.Componentes, error) {
	if moldCode == "" {
		return nil, errors.New("mold code is required")
	}

	components, err := componentsRepo.GetActiveComponentsWithActiveProcessesByMold(moldCode)
	if err != nil {
		return nil, errors.New("error fetching components with active processes: " + err.Error())
	}

	return components, nil
}
