package cncrepo

import (
	"github.com/Gustavoss150/simoldes-backend/models"
)

type CNCRepository interface {
	SaveMach(machine *models.Maquinas) error
	GetMachByID(id string) (*models.Maquinas, error)
	GetAllMachs() ([]*models.Maquinas, error)
	DeleteMach(id string) error
	SaveProgramming(programming *models.Programacoes) error
	GetProgrammingByID(id string) (*models.Programacoes, error)
	GetProgrammingByMold(moldCode string) ([]*models.Programacoes, error)
	GetProgrammingByComponent(componentCode string) ([]*models.Programacoes, error)
	DeleteProgramming(id string) error
}
