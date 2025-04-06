package moldsrepo

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
	"gorm.io/gorm"
)

type moldsRepository struct {
	DB *gorm.DB
}

func InitMoldsDatabase() (MoldsRepository, error) {
	db := config.DB
	if db == nil {
		return nil, errors.New("failed to connect to the database")
	}
	return &moldsRepository{DB: db}, nil
}

func (r *moldsRepository) Save(mold *models.Moldes) error {
	return r.DB.Save(mold).Error
}

func (r *moldsRepository) Get(moldCode string) (*models.Moldes, error) {
	var mold models.Moldes
	if err := r.DB.Where("codigo = ?", moldCode).First(&mold).Error; err != nil {
		return nil, errors.New("mold not found")
	}
	return &mold, nil
}
