package usecases

import (
	"fmt"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	"github.com/google/uuid"
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
