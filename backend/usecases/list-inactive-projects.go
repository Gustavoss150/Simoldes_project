package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
)

func ListInactiveMolds(moldsRepo moldsrepo.MoldsRepository, limit int, offset int) (projects []*models.Moldes, total int, err error) {
	projects, err = moldsRepo.GetAllInactive(limit, offset)
	if err != nil {
		return nil, total, errors.New("error fetching inactive molds: " + err.Error())
	}

	totalMolds, err := moldsRepo.CountInactive()
	if err != nil {
		return nil, total, errors.New("error counting inactive molds: " + err.Error())
	}
	total = int(totalMolds)

	return projects, total, err
}

func ListInactiveComponents(
	componentsRepo componentsrepo.ComponentsRepository,
	moldCode string,
	limit int,
	offset int,
) (components []*models.Componentes, total int, err error) {
	components, err = componentsRepo.GetInactiveByMold(moldCode, limit, offset)
	if err != nil {
		return nil, total, errors.New("error fetching inactive mold components: " + err.Error())
	}

	totalComponents, err := componentsRepo.CountInactiveByMold(moldCode)
	if err != nil {
		return nil, total, errors.New("error counting inactive mold components: " + err.Error())
	}
	total = int(totalComponents)
	return components, total, err
}
