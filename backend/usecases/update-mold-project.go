package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

func updateComponentFields(component *models.Componentes, dto contracts.UpdateComponentOperationDTO) {
	if dto.Quantity != nil {
		component.Quantity = *dto.Quantity
	}
	if dto.Archive3DModel != nil {
		component.Archive3DModel = *dto.Archive3DModel
	}
	if dto.Material != nil {
		component.Material = *dto.Material
	}
	if dto.Steps != nil {
		component.Steps = *dto.Steps
	}
}

func updateProcessFields(process *models.Processos, dto contracts.UpdateProcessOperationDTO) {
	if dto.ComponentesID != nil {
		process.ComponentesID = *dto.ComponentesID
	}
	if dto.StepID != nil {
		process.StepID = *dto.StepID
	}
	if dto.Status != nil {
		process.Status = models.ProcessStatus(*dto.Status)
	}
	if dto.Order != nil {
		process.Order = *dto.Order
	}
}

func UpdateMoldOperation(
	moldsRepo moldsrepo.MoldsRepository,
	componentsRepo componentsrepo.ComponentsRepository,
	processRepo processrepo.ProcessRepository,
	dto contracts.UpdateMoldOperationRequest,
) error {
	mold, err := moldsRepo.Get(dto.MoldeCodigo)
	if err != nil {
		return fmt.Errorf("failed to fetch mold: %w", err)
	}
	if mold == nil {
		return fmt.Errorf("mold with code %s not found", dto.MoldeCodigo)
	}

	// atualizar o molde em si
	if dto.Molde != nil {
		if dto.Molde.Description != nil {
			mold.Description = *dto.Molde.Description
		}
		if dto.Molde.Status != nil {
			mold.Status = *dto.Molde.Status
		}
		if dto.Molde.Steps != nil {
			mold.Steps = *dto.Molde.Steps
		}
		if dto.Molde.DeliveryDate != nil {
			mold.DeliveryDate = *dto.Molde.DeliveryDate
		}
		if err := moldsRepo.Save(mold); err != nil {
			return fmt.Errorf("error updating mold %s: %w", mold.Codigo, err)
		}
	}

	for _, compDTO := range dto.Componentes {
		component, err := componentsRepo.GetByID(compDTO.ComponenteID)
		if err != nil {
			return fmt.Errorf("error fetching component ID %s: %w", compDTO.ComponenteID, err)
		}
		if component == nil {
			return fmt.Errorf("component with ID %s not found", compDTO.ComponenteID)
		}

		updateComponentFields(component, compDTO)

		if err := componentsRepo.Save(component); err != nil {
			return fmt.Errorf("error updating component ID %s: %w", component.ID, err)
		}
	}

	for _, procDTO := range dto.Processos {
		process, err := processRepo.GetProcessByID(procDTO.ProcessoID)
		if err != nil {
			return fmt.Errorf("error fetching process ID %s: %w", procDTO.ProcessoID, err)
		}
		if process == nil {
			return fmt.Errorf("process with ID %s not found", procDTO.ProcessoID)
		}

		// valida componente, se mudou
		if procDTO.ComponentesID != nil {
			comp, err := componentsRepo.GetByID(*procDTO.ComponentesID)
			if err != nil || comp == nil || comp.MoldeCodigo != dto.MoldeCodigo {
				return fmt.Errorf("component ID %s does not belong to mold %s",
					*procDTO.ComponentesID, dto.MoldeCodigo)
			}
		}

		updateProcessFields(process, procDTO)

		if err := processRepo.SaveProcess(process); err != nil {
			return fmt.Errorf("error updating process ID %s: %w", process.ID, err)
		}
	}

	return nil
}
