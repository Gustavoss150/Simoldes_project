package componentsrepo

import "github.com/Gustavoss150/simoldes-backend/models"

type ComponentsRepository interface {
	Save(component *models.Componentes) error
	SaveMany(components []*models.Componentes) error
	GetByID(id string) (*models.Componentes, error)
	GetByMold(moldCode string, limit int, offset int) ([]*models.Componentes, error)
	CountByMold(moldCode string) (int64, error)
	Delete(id string) error
}
