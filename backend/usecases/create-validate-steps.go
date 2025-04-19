package usecases

import (
	"errors"
	"fmt"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateStep(processRepo processrepo.ProcessRepository, req contracts.CreateStepRequest) error {
	id := uuid.NewString()

	existing, err := processRepo.GetStepByID(id)
	if err != nil {
		return fmt.Errorf("error checking existing step ID: %w", err)
	}
	if existing != nil {
		id = uuid.NewString()
	}

	step := models.Etapas{
		ID:          id,
		Name:        req.Name,
		Description: req.Description,
		IsActive:    true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	return processRepo.SaveStep(&step)
}

func CreateManySteps(
	processRepo processrepo.ProcessRepository,
	reqs []contracts.CreateStepRequest,
) error {
	var steps []*models.Etapas
	now := time.Now()
	for _, req := range reqs {
		step := &models.Etapas{
			ID:          uuid.NewString(),
			Name:        req.Name,
			Description: req.Description,
			IsActive:    true,
			CreatedAt:   now,
			UpdatedAt:   now,
		}
		steps = append(steps, step)
	}
	return processRepo.SaveManySteps(steps)
}

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
