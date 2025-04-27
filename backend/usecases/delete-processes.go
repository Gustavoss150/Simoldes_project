package usecases

import (
	"errors"
	"fmt"

	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

func (s *MoldService) SoftDeleteProcess(processID, moldCode string) error {
	proc, err := s.processRepo.GetProcessByID(processID)
	if err != nil || proc == nil {
		return fmt.Errorf("process %s not found", processID)
	}
	if !proc.IsActive {
		return fmt.Errorf("process %s is already inactive", processID)
	}
	if proc.MoldeCodigo != moldCode {
		return fmt.Errorf("process %s does not belong to mold %s", processID, moldCode)
	}

	proc.IsActive = false
	if err := s.processRepo.SaveProcess(proc); err != nil {
		return fmt.Errorf("error saving process %s: %w", processID, err)
	}

	// após deletar processo, atualizar componente
	if err := s.refreshComponentStatus(proc.ComponentesID, moldCode); err != nil {
		return err
	}

	// e recalcular molde
	return s.recalc(moldCode)
}

func SoftDeleteStep(processRepo processrepo.ProcessRepository, stepId string) error {
	step, err := processRepo.GetStepByID(stepId)
	if err != nil || step == nil {
		return errors.New("step not found")
	}

	if !step.IsActive {
		return errors.New("step is already inactive")
	}

	step.IsActive = false
	return processRepo.SaveStep(step)
}
