package moldsrepo

import (
	"errors"
	"fmt"
	"time"

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

func (r *moldsRepository) GetByStatus(status string, limit int, offset int) ([]*models.Moldes, error) {
	var molds []*models.Moldes
	err := r.DB.
		Where("is_active = ? AND status = ?", true, status).
		Limit(limit).
		Offset(offset).
		Find(&molds).Error

	if err != nil {
		return nil, errors.New("error retrieving molds by status: " + err.Error())
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

func (r *moldsRepository) CountByStatus(status string) (int64, error) {
	var count int64
	err := r.DB.
		Model(&models.Moldes{}).
		Where("is_active = ? AND status = ?", true, status).
		Count(&count).Error

	if err != nil {
		return 0, errors.New("error counting molds by status: " + err.Error())
	}
	return count, nil
}

func (r *moldsRepository) GetDelayed(limit int, offset int) ([]*models.Moldes, error) {
	var molds []*models.Moldes
	now := time.Now()
	db := r.DB.
		Where("is_active = ? AND status != ?", true, models.StatusConcluido)

	db = db.Where("delivery_date IS NOT NULL AND delivery_date < ?", now)

	if err := db.Limit(limit).Offset(offset).Find(&molds).Error; err != nil {
		return nil, fmt.Errorf("error retrieving delayed molds: %w", err)
	}
	return molds, nil
}

func (r *moldsRepository) CountDelayed() (int64, error) {
	var count int64
	now := time.Now()
	db := r.DB.
		Model(&models.Moldes{}).
		Where("is_active = ? AND status != ?", true, models.StatusConcluido).
		Where("delivery_date IS NOT NULL AND delivery_date < ?", now)
	if err := db.Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error counting delayed molds: %w", err)
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
		return nil, errors.New("error retrieving inactive molds: " + err.Error())
	}
	return molds, nil
}

func (r *moldsRepository) CountInactive() (int64, error) {
	var count int64
	if err := r.DB.
		Model(&models.Moldes{}).
		Where("is_active = ?", false).
		Count(&count).Error; err != nil {
		return 0, errors.New("error counting inactive molds: " + err.Error())
	}
	return count, nil
}
