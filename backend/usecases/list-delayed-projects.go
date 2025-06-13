package usecases

import (
	"github.com/Gustavoss150/simoldes-backend/models"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
)

func GetDelayedProjects(moldsRepo moldsrepo.MoldsRepository, limit int, offset int) (delayedMolds []*models.Moldes, total int, err error) {
	delayedMolds, err = moldsRepo.GetDelayed(limit, offset)
	if err != nil {
		return nil, 0, err
	}

	totalCount, err := moldsRepo.CountDelayed()
	if err != nil {
		return nil, 0, err
	}

	return delayedMolds, int(totalCount), nil
}
