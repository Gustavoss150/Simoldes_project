package componentsrepo

import "github.com/Gustavoss150/simoldes-backend/models"

type ComponentsRepository interface {
	Save(component *models.Componentes) error
	SaveMany(components []*models.Componentes) error
	GetByID(id string) (*models.Componentes, error)
	SearchActiveByMold(moldCode string) ([]*models.Componentes, error)
	GetByMold(moldCode string, limit int, offset int) ([]*models.Componentes, error)
	GetActiveComponentsWithActiveProcessesByMold(moldCode string) ([]*models.Componentes, error)
	ExistsByID(id string) (bool, error)
	CountActiveByMold(moldCode string) (int64, error)
	GetInactiveByMold(moldCode string, limit int, offset int) ([]*models.Componentes, error)
	CountInactiveByMold(moldCode string) (int64, error)
}
