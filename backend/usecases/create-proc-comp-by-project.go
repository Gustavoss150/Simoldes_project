package usecases

import (
	"fmt"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

func CreateMoldComponentsAndProcesses(
	moldsRepo moldsrepo.MoldsRepository,
	componentsRepo componentsrepo.ComponentsRepository,
	processRepo processrepo.ProcessRepository,
	dto contracts.CreateComponentsAndProcessesRequest,
	moldCode string,
) error {
	mold, err := moldsRepo.Get(moldCode)
	if err != nil || mold == nil {
		return fmt.Errorf("mold with code %s not found", moldCode)
	}
	createdComponents := make(map[string]bool)

	for _, c := range dto.Componentes {
		component, err := componentsRepo.GetByID(c.ID)
		if err != nil {
			return fmt.Errorf("error fetching component ID %s: %w", c.ID, err)
		}

		if component != nil {
			return fmt.Errorf("component with ID %s already exists", c.ID)
		}

		newComponent := &models.Componentes{
			ID:             c.ID,
			MoldeCodigo:    moldCode,
			Name:           c.Name,
			Material:       c.Material,
			Quantity:       c.Quantity,
			Steps:          c.Steps,
			Archive3DModel: c.Archive3DModel,
			IsActive:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		}
		if err := componentsRepo.Save(newComponent); err != nil {
			return fmt.Errorf("error creating component ID %s: %w", c.ID, err)
		}

		createdComponents[c.ID] = true
	}

	for _, p := range dto.Processos {
		if _, exists := createdComponents[p.ComponentesID]; !exists {
			component, err := componentsRepo.GetByID(p.ComponentesID)
			if err != nil {
				return fmt.Errorf("error fetching component ID %s: %w", p.ComponentesID, err)
			}
			if component == nil || component.MoldeCodigo != moldCode {
				return fmt.Errorf("component %s is not linked to mold %s", p.ComponentesID, moldCode)
			}
		}

		process, err := processRepo.GetProcessByID(p.ID)
		if err != nil {
			return fmt.Errorf("error fetching process ID %s: %w", p.ID, err)
		}
		if process != nil {
			return fmt.Errorf("process with ID %s already exists", p.ID)
		}

		newProcess := &models.Processos{
			ID:            p.ID,
			MoldeCodigo:   moldCode,
			ComponentesID: p.ComponentesID,
			Description:   p.Description,
			StepID:        p.StepID,
			Status:        p.Status,
			MaquinaID:     p.MaquinaID,
			BeginDate:     p.BeginDate,
			DeliveryDate:  p.DeliveryDate,
			Notes:         p.Notes,
			Order:         p.Order,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}
		if err := processRepo.SaveProcess(newProcess); err != nil {
			return fmt.Errorf("error creating process ID %s: %w", p.ID, err)
		}
	}

	return nil
}
