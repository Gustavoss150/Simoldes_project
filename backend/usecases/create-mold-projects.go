package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
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

		// 2. Criar o molde
		mold := models.Moldes{
			Codigo:       moldProjectRequest.Molde.Codigo,
			Description:  moldProjectRequest.Molde.Description,
			Status:       moldProjectRequest.Molde.Status,
			BeginDate:    moldProjectRequest.Molde.BeginDate,
			DeliveryDate: moldProjectRequest.Molde.DeliveryDate,
		}
		if err := tx.Save(&mold).Error; err != nil {
			return fmt.Errorf("error creating mold: %w", err)
		}

		// 3. Criar componentes
		for _, compReq := range moldProjectRequest.Componentes {
			// Verificar se os dados essenciais estão presentes
			if compReq.ID == "" || compReq.Name == "" {
				return fmt.Errorf("missing required field in component")
			}
			component := models.Componentes{
				ID:             compReq.ID,
				Name:           compReq.Name,
				Material:       compReq.Material,
				Quantity:       compReq.Quantity,
				Archive3DModel: compReq.Archive3DModel,
				MoldeCodigo:    mold.Codigo, // associação automática
			}
			if err := tx.Save(&component).Error; err != nil {
				return fmt.Errorf("error creating component: %w", err)
			}
		}

		// 4. Criar processos
		for _, procReq := range moldProjectRequest.Processos {
			// Verificação: certifique-se de que o ComponentesID esteja preenchido
			if procReq.ComponentesID == "" {
				return fmt.Errorf("missing ComponentesID in process")
			}
			process := models.Processos{
				ID:            procReq.ID,
				ComponentesID: procReq.ComponentesID,
				Description:   procReq.Description,
				StepID:        procReq.StepID,
				Status:        procReq.Status,
				MaquinaID:     procReq.MaquinaID,
				BeginDate:     procReq.BeginDate,
				DeliveryDate:  procReq.DeliveryDate,
				Notes:         procReq.Notes,
				MoldeCodigo:   mold.Codigo, // associação automática
			}
			if err := tx.Save(&process).Error; err != nil {
				return fmt.Errorf("error creating process: %w", err)
			}
		}
		return nil
	})
}
