package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
)

func ListAllMolds(moldsRepo moldsrepo.MoldsRepository, limit int, offset int) (projects []*models.Moldes, total int, err error) {
	projects, err = moldsRepo.GetAllActive(limit, offset)
	if err != nil {
		return nil, total, errors.New("error fetching active molds: " + err.Error())
	}

	totalMolds, err := moldsRepo.CountActive()
	if err != nil {
		return nil, total, errors.New("error counting active molds: " + err.Error())
	}
	total = int(totalMolds)

	return projects, total, err
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
