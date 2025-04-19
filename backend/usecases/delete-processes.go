package usecases

import (
	"errors"

	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

func SoftDeleteProcess(processRepo processrepo.ProcessRepository, processId string) error {
	process, err := processRepo.GetProcessByID(processId)
	if err != nil || process == nil {
		return errors.New("process not found")
	}

	if !process.IsActive {
		return errors.New("process is already inactive")
	}

	process.IsActive = false
	return processRepo.SaveProcess(process)
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
