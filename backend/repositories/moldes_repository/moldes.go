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

func (r *moldsRepository) GetAllActive(limit int, offset int) ([]*models.Moldes, error) {
	var molds []*models.Moldes
	if err := r.DB.
		Where("is_active = ?", true).
		Limit(limit).
		Offset(offset).
		Find(&molds).Error; err != nil {
		return nil, errors.New("error retrieving active molds: " + err.Error())
	}
	return molds, nil
}

func (r *moldsRepository) CountActive() (int64, error) {
	var count int64
	if err := r.DB.
		Model(&models.Moldes{}).
		Where("is_active = ?", true).
		Count(&count).Error; err != nil {
		return 0, errors.New("error counting active molds: " + err.Error())
	}
	return count, nil
}

func (r *moldsRepository) GetAllInactive(limit int, offset int) ([]*models.Moldes, error) {
	var molds []*models.Moldes
	if err := r.DB.
		Where("is_active = ?", false).
		Limit(limit).
		Offset(offset).
		Find(&molds).Error; err != nil {
		return nil, errors.New("error retrieving active molds: " + err.Error())
	}
	return molds, nil
}

func (r *moldsRepository) CountInactive() (int64, error) {
	var count int64
	if err := r.DB.
		Model(&models.Moldes{}).
		Where("is_active = ?", false).
		Count(&count).Error; err != nil {
		return 0, errors.New("error counting active molds: " + err.Error())
	}
	return count, nil
}
