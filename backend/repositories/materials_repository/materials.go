package materialsrepo

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
	"gorm.io/gorm"
)

type materialsRepository struct {
	DB *gorm.DB
}

func InitMaterialsDatabase() (MaterialsRepository, error) {
	db := config.DB
	if db == nil {
		return nil, errors.New("failed to connect to database")
	}
	return &materialsRepository{DB: db}, nil
}

func (r *materialsRepository) Save(aco *models.ChegadaAcos) error {
	return r.DB.Save(aco).Error
}

func (r *materialsRepository) GetAcoByID(id string) (*models.ChegadaAcos, error) {
	var aco models.ChegadaAcos
	if err := r.DB.Where("id = ?", id).First(&aco).Error; err != nil {
		return nil, errors.New("component not found")
	}
	return &aco, nil
}

func (r *materialsRepository) GetAcosByMold(moldCode string) ([]*models.ChegadaAcos, error) {
	var acos []*models.ChegadaAcos
	if err := r.DB.Where("molde_codigo = ?", moldCode).Find(&acos).Error; err != nil {
		return nil, err
	}
	return acos, nil
}

func (r *materialsRepository) GetAcoByComponent(componentCode string) ([]*models.ChegadaAcos, error) {
	var aco []*models.ChegadaAcos
	if err := r.DB.Where("componentes_id = ?", componentCode).Find(&aco).Error; err != nil {
		return nil, err
	}
	return aco, nil
}
