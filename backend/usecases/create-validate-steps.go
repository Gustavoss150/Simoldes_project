package usecases

import (
	"errors"
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/models"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func ValidateOrCreateStep(processRepo processrepo.ProcessRepository, stepID string, stepName string) (string, error) {
	// Se já veio com um stepID válido, verificar se existe
	if stepID != "" {
		step, err := processRepo.GetStepByID(stepID)
		if err != nil {
			return "", fmt.Errorf("error verifying step: %w", err)
		}
		if step != nil {
			return stepID, nil
		}
	}

	step, err := processRepo.GetStepByName(stepName)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", fmt.Errorf("error retrieving step by name: %w", err)
	}
	if step != nil {
		return step.ID, nil
	}

	// Criar nova etapa
	newStep := models.Etapas{
		ID:       uuid.NewString(),
		Name:     stepName,
		IsActive: true,
	}
	err = processRepo.SaveStep(&newStep)
	if err != nil {
		return "", fmt.Errorf("error creating step: %w", err)
	}
	return newStep.ID, nil
}
