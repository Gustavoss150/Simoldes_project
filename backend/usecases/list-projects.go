package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
)

func ListMoldsByStatus(moldsRepo moldsrepo.MoldsRepository, status string, limit int, offset int) ([]*models.Moldes, int, error) {
	validStatuses := map[string]string{
		"not started": "not started",
		"in process":  "in process",
		"paused":      "paused",
		"completed":   "completed",
	}

	statusEnum, ok := validStatuses[status]
	if !ok && status != "" {
		return nil, 0, errors.New("invalid status filter")
	}

	var (
		molds []*models.Moldes
		count int64
		err   error
	)

	if statusEnum != "" {
		molds, err = moldsRepo.GetByStatus(statusEnum, limit, offset)
		count, _ = moldsRepo.CountByStatus(statusEnum)
	} else {
		molds, err = moldsRepo.GetAllActive(limit, offset)
		count, _ = moldsRepo.CountActive()
	}

	if err != nil {
		return nil, 0, err
	}

	return molds, int(count), nil
}

func ListComponentsByMold(
	componentsRepo componentsrepo.ComponentsRepository,
	moldCode string,
	limit int,
	offset int,
) (components []*models.Componentes, total int, err error) {
	components, err = componentsRepo.GetByMold(moldCode, limit, offset)
	if err != nil {
		return nil, total, errors.New("error fetching mold components: " + err.Error())
	}

	totalComponents, err := componentsRepo.CountActiveByMold(moldCode)
	if err != nil {
		return nil, total, errors.New("error counting active mold components: " + err.Error())
	}
	total = int(totalComponents)

	return components, total, err
}
