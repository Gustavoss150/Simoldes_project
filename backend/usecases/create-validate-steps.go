package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/models"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

func ValidateOrCreateStep(repo processrepo.ProcessRepository, stepID, stepName string) error {
	step, err := repo.GetStepByID(stepID)
	if err != nil {
		return fmt.Errorf("failed to fetch step: %w", err)
	}
	if step == nil {
		if stepName == "" {
			return fmt.Errorf("step %s does not exist and no name was provided to create it", stepID)
		}
		newStep := models.Etapas{
			ID:   stepID,
			Name: stepName,
		}
		if err := repo.SaveStep(&newStep); err != nil {
			return fmt.Errorf("failed to create new step: %w", err)
		}
	}
	return nil
}
