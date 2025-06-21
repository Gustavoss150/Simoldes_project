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

func (r *materialsRepository) CountByIDPrefix(prefix string) (int64, error) {
	// Ex.: prefix = "1679 - 700 - " (com hífen e espaço no final)
	var count int64
	// Usamos LIKE 'prefix%' (atenção ao wildcard '%'):
	if err := r.DB.
		Model(&models.ChegadaAcos{}).
		Where("id LIKE ?", prefix+"%").
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
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
	if err := r.DB.Where("molde_codigo = ? AND is_active = ?", moldCode, true).Find(&acos).Error; err != nil {
		return nil, err
	}
	return acos, nil
}

func (r *materialsRepository) GetAcoByComponent(componentCode string) ([]*models.ChegadaAcos, error) {
	var aco []*models.ChegadaAcos
	if err := r.DB.Where("componentes_id = ? AND is_active = ?", componentCode, true).Find(&aco).Error; err != nil {
		return nil, err
	}
	return aco, nil
}

func (r *materialsRepository) GetInactiveByMold(moldCode string) ([]*models.ChegadaAcos, error) {
	var acos []*models.ChegadaAcos
	if err := r.DB.Where("molde_codigo = ? AND is_active = ?", moldCode, false).Find(&acos).Error; err != nil {
		return nil, err
	}
	return acos, nil
}
