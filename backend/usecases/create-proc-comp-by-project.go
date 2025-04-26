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
		m, err := moldsRepo.Get(moldCode)
		if err != nil || m == nil {
			return fmt.Errorf("mold %s not found", moldCode)
		}
		// criar novos componentes
		batch := make(map[string]bool)
		for _, c := range dto.Componentes {
			if c.ID == "" || c.Name == "" {
				return fmt.Errorf("missing component field")
			}
			exists, _ := componentsRepo.ExistsByID(c.ID)
			if exists {
				return fmt.Errorf("component %s already exists", c.ID)
			}
			comp := &models.Componentes{
				ID:             c.ID,
				MoldeCodigo:    moldCode,
				Name:           c.Name,
				Material:       c.Material,
				Quantity:       c.Quantity,
				Archive3DModel: c.Archive3DModel,
				IsActive:       true,
				CreatedAt:      time.Now(),
				UpdatedAt:      time.Now(),
			}
			if err := componentsRepo.Save(comp); err != nil {
				return err
			}
			batch[c.ID] = true
		}
		// criar novos processos
		for _, p := range dto.Processos {
			if !batch[p.ComponentesID] {
				return fmt.Errorf("component %s not part of batch", p.ComponentesID)
			}
			if exists, _ := processRepo.ExistsByID(p.ID); exists {
				return fmt.Errorf("process %s already exists", p.ID)
			}
			stepID, _ := ValidateOrCreateStep(processRepo, p.StepID, p.StepName)
			proc := &models.Processos{
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
			if err := processRepo.SaveProcess(proc); err != nil {
				return err
			}
		}
		// recalc após adicionar
		svc := NewMoldService(moldsRepo, componentsRepo, processRepo)
		return svc.recalc(moldCode)
	})
}
