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
	moldProjectRequest contracts.CreateMoldProjectRequest,
) error {
	return config.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Verificar se o molde já existe
		if existing, _ := moldsRepo.Get(moldProjectRequest.Molde.Codigo); existing != nil {
			return fmt.Errorf("mold with code %s already exists", moldProjectRequest.Molde.Codigo)
		}

		// 2. Criar molde
		if err := createMold(moldsRepo, moldProjectRequest.Molde); err != nil {
			return err
		}

		// 3. Criar componentes
		if err := createComponents(componentsRepo, moldProjectRequest.Molde.Codigo, moldProjectRequest.Componentes); err != nil {
			return err
		}

		// 4. Criar processos
		if err := createProcesses(processRepo, moldProjectRequest.Processos, moldProjectRequest.Molde.Codigo); err != nil {
			return err
		}

		return nil
	})
}

func createMold(moldsRepo moldsrepo.MoldsRepository, req contracts.CreateMoldRequest) error {
	m := &models.Moldes{
		Codigo:       req.Codigo,
		Description:  req.Description,
		Status:       req.Status,
		Steps:        req.Steps,
		BeginDate:    req.BeginDate,
		DeliveryDate: req.DeliveryDate,
		IsActive:     true,
	}
	if err := moldsRepo.Save(m); err != nil {
		return fmt.Errorf("error creating mold %s: %w", req.Codigo, err)
	}
	return nil
}

func createComponents(
	componentsRepo componentsrepo.ComponentsRepository,
	moldCode string,
	list []contracts.CreateComponentRequest,
) error {
	for _, c := range list {
		if c.ID == "" || c.Name == "" {
			return fmt.Errorf("missing required field in component")
		}

		existing, err := componentsRepo.GetByID(c.ID)
		if err != nil {
			return fmt.Errorf("error checking component ID %s: %w", c.ID, err)
		}
		if existing != nil {
			return fmt.Errorf("component with ID %s already exists", c.ID)
		}

		comp := &models.Componentes{
			ID:             c.ID,
			MoldeCodigo:    moldCode,
			Name:           c.Name,
			Material:       c.Material,
			Quantity:       c.Quantity,
			Steps:          c.Steps,
			Status:         false, // inicia não concluído
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
	// coleta IDs válidos (você já salvou todos os componentes acima)
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

		existing, err := processRepo.GetProcessByID(p.ID)
		if err != nil {
			return fmt.Errorf("error fetching process ID %s: %w", p.ID, err)
		}
		if existing != nil {
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
