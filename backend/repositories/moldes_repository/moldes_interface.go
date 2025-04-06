package moldsrepo

import "github.com/Gustavoss150/simoldes-backend/models"

type MoldsRepository interface {
	Save(mold *models.Moldes) error
	Get(moldCode string) (*models.Moldes, error)
}
