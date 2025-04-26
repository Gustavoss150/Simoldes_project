package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateMoldProject(
	moldsRepo moldsrepo.MoldsRepository,
	componentsRepo componentsrepo.ComponentsRepository,
	processRepo processrepo.ProcessRepository,
	req contracts.CreateMoldProjectRequest,
) error {
	return config.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Verificar existência
		if existing, _ := moldsRepo.Get(req.Molde.Codigo); existing != nil {
			return fmt.Errorf("mold with code %s already exists", req.Molde.Codigo)
		}

		// 2. Criar molde
		m := &models.Moldes{
			Codigo:       req.Molde.Codigo,
			Description:  req.Molde.Description,
			Status:       req.Molde.Status,
			BeginDate:    req.Molde.BeginDate,
			DeliveryDate: req.Molde.DeliveryDate,
			IsActive:     true,
		}
		if err := moldsRepo.Save(m); err != nil {
			return fmt.Errorf("error creating mold %s: %w", req.Molde.Codigo, err)
		}

		// 3. Criar componentes
		if err := createComponents(componentsRepo, req.Molde.Codigo, req.Componentes); err != nil {
			return err
		}

		// 4. Criar processos
		if err := createProcesses(processRepo, req.Processos, req.Molde.Codigo); err != nil {
			return err
		}

		// 5. Recalcular Steps e CurrentStep
		svc := NewMoldService(moldsRepo, componentsRepo, processRepo)
		if err := svc.recalc(req.Molde.Codigo); err != nil {
			return fmt.Errorf("error recalculating mold steps: %w", err)
		}

		return nil
	})
}

// createComponents cria múltiplos componentes (sem atribuir Steps)
func createComponents(
	componentsRepo componentsrepo.ComponentsRepository,
	moldCode string,
	list []contracts.CreateComponentRequest,
) error {
	for _, c := range list {
		if c.ID == "" || c.Name == "" {
			return fmt.Errorf("missing required field in component")
		}

		if existing, _ := componentsRepo.GetByID(c.ID); existing != nil {
			return fmt.Errorf("component with ID %s already exists", c.ID)
		}

		comp := &models.Componentes{
			ID:             c.ID,
			MoldeCodigo:    moldCode,
			Name:           c.Name,
			Material:       c.Material,
			Quantity:       c.Quantity,
			Status:         false,
			Archive3DModel: c.Archive3DModel,
			IsActive:       true,
		}
		if err := componentsRepo.Save(comp); err != nil {
			return fmt.Errorf("error creating component %s: %w", c.ID, err)
		}
	}
	return nil
}

func createProcesses(
	processRepo processrepo.ProcessRepository,
	list []contracts.CreateProcessRequest,
	moldCode string,
) error {
	valid := make(map[string]bool)
	for _, p := range list {
		valid[p.ComponentesID] = true
	}

	for _, p := range list {
		if p.ComponentesID == "" {
			return fmt.Errorf("missing ComponentesID in process")
		}
		if !valid[p.ComponentesID] {
			return fmt.Errorf("component %s is not linked to mold %s", p.ComponentesID, moldCode)
		}

		if existing, _ := processRepo.GetProcessByID(p.ID); existing != nil {
			return fmt.Errorf("process with ID %s already exists", p.ID)
		}

		stepID, err := ValidateOrCreateStep(processRepo, p.StepID, p.StepName)
		if err != nil {
			return fmt.Errorf("error validating or creating step: %w", err)
		}

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
		}
		if err := processRepo.SaveProcess(proc); err != nil {
			return fmt.Errorf("error creating process for component %s: %w", p.ComponentesID, err)
		}
	}
	return nil
}
