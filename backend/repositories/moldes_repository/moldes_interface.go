package moldsrepo

import "github.com/Gustavoss150/simoldes-backend/models"

type MoldsRepository interface {
	Save(mold *models.Moldes) error
	Get(moldCode string) (*models.Moldes, error)
	GetAllActive(limit int, offset int) (molds []*models.Moldes, err error)
	CountActive() (int64, error)
	GetAllInactive(limit int, offset int) ([]*models.Moldes, error)
	CountInactive() (int64, error)
}
