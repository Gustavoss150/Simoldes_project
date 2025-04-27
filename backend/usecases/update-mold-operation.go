package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

// UpdateMoldOperation unifica atualização de molde, componentes e processos
func UpdateMoldOperation(
	moldsRepo moldsrepo.MoldsRepository,
	componentsRepo componentsrepo.ComponentsRepository,
	processRepo processrepo.ProcessRepository,
	dto contracts.UpdateMoldOperationRequest,
	moldCode string,
) error {
	// inicializa service
	svc := NewMoldService(moldsRepo, componentsRepo, processRepo)

	// 1) atualizar dados do molde se houver
	if dto.Molde != nil {
		m, err := moldsRepo.Get(moldCode)
		if err != nil || m == nil {
			return fmt.Errorf("mold %s not found", moldCode)
		}
		if dto.Molde.Description != nil {
			m.Description = *dto.Molde.Description
		}
		if dto.Molde.Status != nil {
			m.Status = *dto.Molde.Status
		}
		if dto.Molde.DeliveryDate != nil {
			m.DeliveryDate = *dto.Molde.DeliveryDate
		}
		if err := moldsRepo.Save(m); err != nil {
			return fmt.Errorf("error updating mold: %w", err)
		}
	}

	// 2) atualizar componentes individuais (campo, nome, material, quantidade)
	for _, compDTO := range dto.Componentes {
		// carregar componente
		comp, err := componentsRepo.GetByID(compDTO.ComponenteID)
		if err != nil || comp == nil {
			return fmt.Errorf("component %s not found", compDTO.ComponenteID)
		}

		if comp.MoldeCodigo != moldCode {
			return fmt.Errorf("component %s does not belong to mold %s", compDTO.ComponenteID, moldCode)
		}
		if compDTO.Quantity != nil {
			comp.Quantity = *compDTO.Quantity
		}
		if compDTO.Material != nil {
			comp.Material = *compDTO.Material
		}
		if compDTO.Archive3DModel != nil {
			comp.Archive3DModel = *compDTO.Archive3DModel
		}
		// persiste modificação
		if err := componentsRepo.Save(comp); err != nil {
			return fmt.Errorf("error saving component %s: %w", comp.ID, err)
		}
	}

	// 3) atualizar processos via service (inclui recalc componente e mold)
	for _, procDTO := range dto.Processos {
		if err := svc.UpdateProcessAndRefresh(procDTO, moldCode); err != nil {
			return err
		}
	}

	return nil
}
