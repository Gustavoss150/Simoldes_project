package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

func UpdateSteps(processRepo processrepo.ProcessRepository, req contracts.UpdateStepsRequest, stepID string) error {
	step, err := processRepo.GetStepByID(stepID)
	if err != nil || step == nil {
		return errors.New("step not found")
	}

	if req.Name != nil {
		step.Name = *req.Name
	}
	if req.Description != nil {
		step.Description = *req.Description
	}

	if err = processRepo.SaveStep(step); err != nil { // se aqui falhar, testar com ponteiro (&step)
		return errors.New("error updating step")
	}

	return nil
}
