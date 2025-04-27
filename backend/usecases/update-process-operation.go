package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

// MoldService encapsula lógica de Steps, CurrentStep e status de componentes
type MoldService struct {
	moldsRepo      moldsrepo.MoldsRepository
	componentsRepo componentsrepo.ComponentsRepository
	processRepo    processrepo.ProcessRepository
}

// NewMoldService instancia o serviço
func NewMoldService(
	m moldsrepo.MoldsRepository,
	c componentsrepo.ComponentsRepository,
	p processrepo.ProcessRepository,
) *MoldService {
	return &MoldService{moldsRepo: m, componentsRepo: c, processRepo: p}
}

// recalc recalcula Steps e CurrentStep de um molde e persiste
func (s *MoldService) recalc(moldCode string) error {
	// buscar todos componentes ativos do molde
	activeComponents, err := s.componentsRepo.SearchActiveByMold(moldCode)
	if err != nil {
		return fmt.Errorf("error fetching active components for mold %s: %w", moldCode, err)
	}

	total := 0
	done := 0
	inProcess := false

	for _, comp := range activeComponents {
		procs, err := s.processRepo.GetProcessByComponent(comp.ID)
		if err != nil {
			return fmt.Errorf("error fetching processes for component %s: %w", comp.ID, err)
		}
		for _, p := range procs {
			total++
			if p.Status == models.StatusConcluido {
				done++
			}
			if p.Status == models.StatusEmProcesso {
				inProcess = true
			}
		}
	}

	m, err := s.moldsRepo.Get(moldCode)
	if err != nil {
		return err
	}

	m.Steps = total
	m.CurrentStep = done

	switch {
	case m.CurrentStep > 0 && m.CurrentStep == m.Steps:
		m.Status = models.StatusConcluido
	case inProcess:
		m.Status = models.StatusEmProcesso
		// opcional: senão, poderia ser not_started ou paused dependendo da regra
	}

	return s.moldsRepo.Save(m)
}

// UpdateProcessAndRefresh aplica DTO, salva processo, atualiza componente e recalcula molde
func (s *MoldService) UpdateProcessAndRefresh(
	dto contracts.UpdateProcessOperationDTO,
	moldCode string,
) error {
	// carregar e aplicar no processo
	proc, err := s.processRepo.GetProcessByID(dto.ProcessoID)
	if err != nil || proc == nil {
		return fmt.Errorf("process %s not found", dto.ProcessoID)
	}
	// 1.1) verificar pertencimento ao molde
	if proc.MoldeCodigo != moldCode {
		return fmt.Errorf("process %s does not belong to mold %s", dto.ProcessoID, moldCode)
	}

	if dto.ComponentesID != nil {
		proc.ComponentesID = *dto.ComponentesID
	}
	if dto.StepID != nil {
		proc.StepID = *dto.StepID
	}
	if dto.Status != nil {
		proc.Status = *dto.Status
	}
	if dto.Order != nil {
		proc.Order = *dto.Order
	}
	if err := s.processRepo.SaveProcess(proc); err != nil {
		return fmt.Errorf("error saving process: %w", err)
	}

	// após salvar processo, atualizar status do componente
	if err := s.refreshComponentStatus(proc.ComponentesID, moldCode); err != nil {
		return err
	}
	// por fim recalc molde inteiro
	return s.recalc(moldCode)
}

// refreshComponentStatus marca componente como concluído quando todos os processos estiverem completed
func (s *MoldService) refreshComponentStatus(componentID, moldCode string) error {
	comp, err := s.componentsRepo.GetByID(componentID)
	if err != nil || comp == nil {
		return fmt.Errorf("component %s not found", componentID)
	}
	if comp.MoldeCodigo != moldCode {
		return fmt.Errorf("component %s does not belong to mold %s", componentID, moldCode)
	}
	// carregar processos do componente
	procs, err := s.processRepo.GetProcessByComponent(componentID)
	if err != nil {
		return fmt.Errorf("error loading processes for component %s: %w", componentID, err)
	}
	allDone := true
	for _, p := range procs {
		if p.Status != models.StatusConcluido {
			allDone = false
			break
		}
	}
	// só salva se mudou
	if comp.Status != allDone {
		comp.Status = allDone
		if err := s.componentsRepo.Save(comp); err != nil {
			return fmt.Errorf("error saving component status %s: %w", componentID, err)
		}
	}
	return nil
}
