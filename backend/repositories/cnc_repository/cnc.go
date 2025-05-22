package cncrepo

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
	"gorm.io/gorm"
)

type cncRepository struct {
	DB *gorm.DB
}

func InitCNCDatabase() (CNCRepository, error) {
	db := config.DB
	if db == nil {
		return nil, errors.New("failed to connect to database")
	}
	return &cncRepository{DB: db}, nil
}

func (r *cncRepository) SaveMach(machine *models.Maquinas) error {
	return r.DB.Save(machine).Error
}

func (r *cncRepository) GetMachByID(id string) (*models.Maquinas, error) {
	var machine models.Maquinas
	if err := r.DB.Where("id = ?", id).First(&machine).Error; err != nil {
		return nil, errors.New("component not found")
	}
	return &machine, nil
}

func (r *cncRepository) GetAllMachs() ([]*models.Maquinas, error) {
	var machines []*models.Maquinas
	if err := r.DB.Find(&machines).Error; err != nil {
		return nil, errors.New("error retrieving all machines: " + err.Error())
	}
	return machines, nil
}

func (r *cncRepository) DeleteMach(id string) error {
	return r.DB.Where("id = ?", id).Delete(&models.Maquinas{}).Error
}

func (r *cncRepository) SaveProgramming(programming *models.Programacoes) error {
	return r.DB.Save(programming).Error
}

func (r *cncRepository) GetProgrammingByID(id string) (*models.Programacoes, error) {
	var programming models.Programacoes
	if err := r.DB.Where("id = ?", id).First(&programming).Error; err != nil {
		return nil, errors.New("component not found")
	}
	return &programming, nil
}

func (r *cncRepository) GetProgrammingByMold(moldCode string) ([]*models.Programacoes, error) {
	var programming []*models.Programacoes
	if err := r.DB.Where("molde_codigo = ?", moldCode).Find(&programming).Error; err != nil {
		return nil, err
	}
	return programming, nil
}

func (r *cncRepository) GetProgrammingByComponent(componentCode string) ([]*models.Programacoes, error) {
	var programming []*models.Programacoes
	if err := r.DB.Where("componente_id = ? AND is_active = ?", componentCode, true).Find(&programming).Error; err != nil {
		return nil, err
	}
	return programming, nil
}

func (r *cncRepository) ValidateProcessWithMold(processID string, moldCode string) (bool, error) {
	var count int64
	if err := r.DB.
		Model(&models.Processos{}).
		Where("id = ? AND molde_codigo = ?", processID, moldCode).
		Count(&count).
		Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *cncRepository) ValidateProcessWithComponent(processID string, componenteID string) (bool, error) {
	var count int64
	err := r.DB.
		Model(&models.Processos{}).
		Where("id = ? AND componentes_id = ?", processID, componenteID).
		Count(&count).
		Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
