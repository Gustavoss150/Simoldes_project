package processrepo

import (
	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
)

type ProcessRepository interface {
	SaveProcess(process *models.Processos) error
	SaveManyProcess(processes []*models.Processos) error
	GetProcessByID(id string) (*models.Processos, error)
	GetProcessByMold(moldCode string) ([]*models.Processos, error)
	GetInactiveProcessByMold(moldCode string) ([]*models.Processos, error)
	SaveStep(step *models.Etapas) error
	SaveManySteps(steps []*models.Etapas) error
	GetStepByID(id string) (*models.Etapas, error)
	GetStepByName(name string) (*models.Etapas, error)
	GetAllSteps() ([]*models.Etapas, error)
	GetAllInactiveSteps() ([]*models.Etapas, error)
	GetProcessAndStepsByMold(moldCode string) ([]contracts.StepsByComponent, error)
	GetProcessByComponent(componentID string) ([]*models.Processos, error)
}
