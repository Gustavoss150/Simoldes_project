package componentsrepo

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
	"gorm.io/gorm"
)

type componentsRepository struct {
	DB *gorm.DB
}

func InitComponentsDatabase() (ComponentsRepository, error) {
	db := config.DB
	if db == nil {
		return nil, errors.New("failed to connect to the database")
	}
	return &componentsRepository{DB: db}, nil
}

func (r *componentsRepository) Save(component *models.Componentes) error {
	return r.DB.Save(component).Error
}

func (r *componentsRepository) SaveMany(components []*models.Componentes) error {
	tx := r.DB.Begin()
	for _, c := range components {
		if err := tx.Create(c).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}

func (r *componentsRepository) GetByID(id string) (*models.Componentes, error) {
	var component models.Componentes
	if err := r.DB.Where("id = ?", id).First(&component).Error; err != nil {
		return nil, errors.New("component not found")
	}
	return &component, nil
}

func (r *componentsRepository) GetByMold(moldCode string, limit int, offset int) ([]*models.Componentes, error) {
	var components []*models.Componentes
	if err := r.DB.
		Where("molde_codigo = ?", moldCode).
		Find(&components).
		Limit(limit).
		Offset(offset).
		Error; err != nil {
		return nil, errors.New("error retrieving all mold components: " + err.Error())
	}
	return components, nil
}

func (r *componentsRepository) CountByMold(moldCode string) (int64, error) {
	var count int64
	if err := r.DB.
		Model(&models.Componentes{}).
		Where("molde_codigo = ?", moldCode).
		Count(&count).
		Error; err != nil {
		return 0, errors.New("error counting components by mold: " + err.Error())
	}
	return count, nil
}

func (r *componentsRepository) Delete(id string) error {
	return r.DB.Delete(&models.Componentes{}, "id = ?", id).Error
}
