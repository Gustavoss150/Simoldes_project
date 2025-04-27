package usecases

import (
	"errors"
	"fmt"

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

func (s *MoldService) SoftDeleteComponents(componentID, moldCode string) error {
	comp, err := s.componentsRepo.GetByID(componentID)
	if err != nil || comp == nil {
		return fmt.Errorf("component %s not found", componentID)
	}
	if !comp.IsActive {
		return fmt.Errorf("component %s is already inactive", componentID)
	}
	if comp.MoldeCodigo != moldCode {
		return fmt.Errorf("component %s does not belong to mold %s", componentID, moldCode)
	}

	comp.IsActive = false
	if err := s.componentsRepo.Save(comp); err != nil {
		return fmt.Errorf("error saving component %s: %w", componentID, err)
	}

	// após deletar componente, recalcular molde
	return s.recalc(moldCode)
}
