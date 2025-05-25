package usecases

import (
	"fmt"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	"github.com/google/uuid"
)

func CreateProcessesToComponent(
	componentID string,
	processRepo processrepo.ProcessRepository,
	componentsRepo componentsrepo.ComponentsRepository,
	moldsRepo moldsrepo.MoldsRepository,
	dto contracts.AddProcessToComponentDTO,
) error {
	// Busca o componente
	component, err := componentsRepo.GetByID(componentID)
	if err != nil {
		return fmt.Errorf("component not found: %w", err)
	}

	if component.MoldeCodigo == "" {
		return fmt.Errorf("component does not have a valid molde_codigo")
	}

	for _, p := range dto.Processos {
		process := models.Processos{
			ID:            uuid.New().String(),
			ComponentesID: component.ID,
			MoldeCodigo:   component.MoldeCodigo,
			Description:   p.Description,
			StepID:        p.StepID,
			Status:        p.Status,
			MaquinaID:     p.MaquinaID,
			BeginDate:     p.BeginDate,
			DeliveryDate:  p.DeliveryDate,
			Notes:         p.Notes,
			Order:         p.Order,
			IsActive:      true,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		if err := processRepo.SaveProcess(&process); err != nil {
			return fmt.Errorf("error creating process: %w", err)
		}
	}

	// Recalcula Steps e CurrentStep do molde
	svc := NewMoldService(moldsRepo, componentsRepo, processRepo)
	if err := svc.recalc(component.MoldeCodigo); err != nil {
		return fmt.Errorf("error recalculating mold after adding processes: %w", err)
	}

	return nil
}
