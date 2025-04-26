package usecases

import (
	"fmt"
	"time"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateMoldComponentsAndProcesses(
	moldsRepo moldsrepo.MoldsRepository,
	componentsRepo componentsrepo.ComponentsRepository,
	processRepo processrepo.ProcessRepository,
	dto contracts.CreateComponentsAndProcessesRequest,
	moldCode string,
) error {
	return config.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Verificar se o molde existe
		mold, err := moldsRepo.Get(moldCode)
		if err != nil || mold == nil {
			return fmt.Errorf("mold with code %s not found", moldCode)
		}

		// 2. Criar componentes
		createdComponents := make(map[string]bool)
		for _, c := range dto.Componentes {
			if c.ID == "" || c.Name == "" {
				return fmt.Errorf("missing required field in component")
			}

			exists, err := componentsRepo.ExistsByID(c.ID)
			if err != nil {
				return fmt.Errorf("error checking component ID %s: %w", c.ID, err)
			}
			if exists {
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
				return fmt.Errorf("error saving component ID %s: %w", c.ID, err)
			}
			createdComponents[c.ID] = true
		}

		// 3. Criar processos
		for _, p := range dto.Processos {
			if p.ComponentesID == "" {
				return fmt.Errorf("missing ComponentesID in process")
			}
			if _, ok := createdComponents[p.ComponentesID]; !ok {
				return fmt.Errorf("component %s is not part of the new batch", p.ComponentesID)
			}

			exists, err := processRepo.ExistsByID(p.ID)
			if err != nil {
				return fmt.Errorf("error checking process ID %s: %w", p.ID, err)
			}
			if exists {
				return fmt.Errorf("process with ID %s already exists", p.ID)
			}

			stepID, err := ValidateOrCreateStep(processRepo, p.StepID, p.StepName)
			if err != nil {
				return fmt.Errorf("error validating or creating step: %w", err)
			}

			newProcess := &models.Processos{
				ID:            uuid.NewString(),
				MoldeCodigo:   moldCode,
				ComponentesID: p.ComponentesID,
				Description:   p.Description,
				StepID:        stepID,
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

			if err := processRepo.SaveProcess(newProcess); err != nil {
				return fmt.Errorf("error saving process for component %s: %w", p.ComponentesID, err)
			}
		}

		return nil
	})
}
