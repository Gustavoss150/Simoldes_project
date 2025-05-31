package materialsrepo

import "github.com/Gustavoss150/simoldes-backend/models"

type MaterialsRepository interface {
	Save(aco *models.ChegadaAcos) error
	CountByIDPrefix(prefix string) (int64, error)
	GetAcoByID(id string) (*models.ChegadaAcos, error)
	GetAcosByMold(moldCode string) ([]*models.ChegadaAcos, error)
	GetAcoByComponent(componentCode string) ([]*models.ChegadaAcos, error)
}
