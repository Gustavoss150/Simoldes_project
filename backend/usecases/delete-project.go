package usecases

import (
	"errors"

	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
)

func SoftDeleteMold(moldsRepo moldsrepo.MoldsRepository, moldCode string) error {
	mold, err := moldsRepo.Get(moldCode)
	if err != nil || mold == nil {
		return errors.New("mold not found")
	}

	if !mold.IsActive {
		return errors.New("mold is already inactive")
	}

	mold.IsActive = false
	return moldsRepo.Save(mold)
}

func SoftDeleteComponents(componentsRepo componentsrepo.ComponentsRepository, componentID string) error {
	component, err := componentsRepo.GetByID(componentID)
	if err != nil || component == nil {
		return errors.New("component not found")
	}

	if !component.IsActive {
		return errors.New("component is already inactive")
	}

	component.IsActive = false
	return componentsRepo.Save(component)
}
