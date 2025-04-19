package usecases

import (
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

func ListProcessesWithStepsByMold(processRepo processrepo.ProcessRepository, moldCode string) ([]contracts.StepsByComponent, error) {
	stepsByComponent, err := processRepo.GetProcessAndStepsByMold(moldCode)
	if err != nil {
		return nil, fmt.Errorf("error retrieving processes and steps for mold %s: %w", moldCode, err)
	}
	return stepsByComponent, nil
}

func ListInactiveProcessesByMold(processRepo processrepo.ProcessRepository, moldCode string) ([]*models.Processos, error) {
	inactiveProcesses, err := processRepo.GetInactiveProcessByMold(moldCode)
	if err != nil {
		return nil, fmt.Errorf("error retrieving inactive processes for mold %s: %w", moldCode, err)
	}
	return inactiveProcesses, nil
}

func ListAllInactiveSteps(processRepo processrepo.ProcessRepository) ([]*models.Etapas, error) {
	inactiveSteps, err := processRepo.GetAllInactiveSteps()
	if err != nil {
		return nil, fmt.Errorf("error retrieving all inactive steps: %w", err)
	}
	return inactiveSteps, nil
}
