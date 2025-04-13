package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

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

	// Atualiza os componentes (se fornecidos)
	for _, compDTO := range dto.Componentes {
		component, err := componentsRepo.GetByID(compDTO.ComponenteID)
		if err != nil {
			return fmt.Errorf("error fetching component ID %s: %w", compDTO.ComponenteID, err)
		}
		if component == nil {
			return fmt.Errorf("component with ID %s not found", compDTO.ComponenteID)
		}

		if compDTO.Quantity != nil {
			component.Quantity = *compDTO.Quantity
		}
		if compDTO.Archive3DModel != "" {
			component.Archive3DModel = compDTO.Archive3DModel
		}
		if compDTO.Material != "" {
			component.Material = compDTO.Material
		}

		if err := componentsRepo.Save(component); err != nil {
			return fmt.Errorf("error updating component ID %s: %w", component.ID, err)
		}
	}

	// Atualiza os processos (se fornecidos)
	for _, procDTO := range dto.Processos {
		process, err := processRepo.GetProcessByID(procDTO.ProcessoID)
		if err != nil {
			return fmt.Errorf("error fetching process ID %s: %w", procDTO.ProcessoID, err)
		}
		if process == nil {
			return fmt.Errorf("process with ID %s not found", procDTO.ProcessoID)
		}

		// Validação se o componente do processo pertence ao molde atual
		comp, err := componentsRepo.GetByID(procDTO.ComponentesID)
		if err != nil || comp == nil || comp.MoldeCodigo != dto.MoldeCodigo {
			return fmt.Errorf("component ID %s does not belong to mold %s", procDTO.ComponentesID, dto.MoldeCodigo)
		}

		process.ComponentesID = procDTO.ComponentesID
		process.StepID = procDTO.StepID
		process.Status = models.ProcessStatus(procDTO.Status)

		if err := processRepo.SaveProcess(process); err != nil {
			return fmt.Errorf("error updating process ID %s: %w", process.ID, err)
		}
	}

	return nil
}
