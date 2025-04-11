package processrepo

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
	"gorm.io/gorm"
)

type processRepository struct {
	DB *gorm.DB
}

func InitProcessDatabase() (ProcessRepository, error) {
	db := config.DB
	if db == nil {
		return nil, errors.New("failed to connect to database")
	}
	return &processRepository{DB: db}, nil
}

func (r *processRepository) SaveProcess(process *models.Processos) error {
	return r.DB.Save(process).Error
}

func (r *processRepository) SaveManyProcess(processes []*models.Processos) error {
	tx := r.DB.Begin()
	for _, c := range processes {
		if err := tx.Create(c).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}

func (r *processRepository) GetProcessByID(id string) (*models.Processos, error) {
	var process models.Processos
	if err := r.DB.Where("id = ?", id).First(&process).Error; err != nil {
		return nil, errors.New("process not found")
	}
	return &process, nil
}

func (r *processRepository) GetProcessByMold(moldCode string) ([]*models.Processos, error) {
	var processes []*models.Processos
	if err := r.DB.Where("molde_codigo = ?", moldCode).Find(&processes).Error; err != nil {
		return nil, err
	}
	return processes, nil
}

func (r *processRepository) DeleteProcess(id string) error {
	return r.DB.Delete(&models.Processos{}, "id = ?", id).Error
}

func (r *processRepository) SaveStep(step *models.Etapas) error {
	return r.DB.Save(step).Error
}

func (r *processRepository) SaveManySteps(steps []*models.Etapas) error {
	tx := r.DB.Begin()
	for _, c := range steps {
		if err := tx.Create(c).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}

func (r *processRepository) GetStepByID(id string) (*models.Etapas, error) {
	var step models.Etapas
	if err := r.DB.Where("id = ?", id).First(&step).Error; err != nil {
		return nil, errors.New("step not found")
	}
	return &step, nil
}

func (r *processRepository) GetAllSteps() ([]*models.Etapas, error) {
	var steps []*models.Etapas
	if err := r.DB.Find(&steps).Error; err != nil {
		return nil, errors.New("error retrieving all molds: " + err.Error())
	}
	return steps, nil
}

func (r *processRepository) DeleteStep(id string) error {
	return r.DB.Delete(&models.Etapas{}, "id = ?", id).Error
}
