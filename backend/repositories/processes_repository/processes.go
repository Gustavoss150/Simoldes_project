package processrepo

import (
	"errors"
	"fmt"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/contracts"
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
	if err := r.DB.Where("molde_codigo = ? AND is_active = ?", moldCode, true).Find(&processes).Error; err != nil {
		return nil, err
	}
	return processes, nil
}

func (r *processRepository) GetInactiveProcessByMold(moldCode string) ([]*models.Processos, error) {
	var processes []*models.Processos
	if err := r.DB.Where("molde_codigo = ? AND is_active = ?", moldCode, false).Find(&processes).Error; err != nil {
		return nil, err
	}
	return processes, nil
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

func (r *processRepository) GetStepByName(name string) (*models.Etapas, error) {
	var step models.Etapas
	if err := r.DB.Where("name = ?", name).First(&step).Error; err != nil {
		return nil, err
	}
	return &step, nil
}

func (r *processRepository) GetAllSteps() ([]*models.Etapas, error) {
	var steps []*models.Etapas
	if err := r.DB.Where("is_active = ?", true).Find(&steps).Error; err != nil {
		return nil, errors.New("error retrieving all active steps: " + err.Error())
	}
	return steps, nil
}

func (r *processRepository) GetAllInactiveSteps() ([]*models.Etapas, error) {
	var steps []*models.Etapas
	if err := r.DB.Where("is_active = ?", false).Find(&steps).Error; err != nil {
		return nil, errors.New("error retrieving all inactive steps: " + err.Error())
	}
	return steps, nil
}

func (r *processRepository) GetProcessAndStepsByMold(moldCode string) ([]contracts.StepsByComponent, error) {
	query := `
		SELECT 
			c.id AS component_id,
			c.name AS component_name,
			p.id AS process_id,
			p.order AS process_order,
			p.status AS process_status,
			p.notes AS process_notes,
			e.id AS step_id,
			e.name AS step_name,
			e.description AS step_description
		FROM processos p
		INNER JOIN componentes c ON p.componentes_id = c.id
		INNER JOIN etapas e ON p.step_id = e.id
		WHERE p.molde_codigo = ? AND p.is_active = TRUE AND c.is_active = TRUE AND e.is_active = TRUE
		ORDER BY c.id, p.order ASC
	`

	// Struct temporária para mapear os dados brutos da query
	type rawResult struct {
		ComponentID     string
		ComponentName   string
		ProcessID       string
		ProcessOrder    int
		ProcessStatus   string
		ProcessNotes    string
		StepID          string
		StepName        string
		StepDescription string
	}

	var raw []rawResult
	if err := r.DB.Raw(query, moldCode).Scan(&raw).Error; err != nil {
		return nil, fmt.Errorf("failed to query grouped steps: %w", err)
	}

	// Agrupar os resultados por componente
	grouped := make(map[string]contracts.StepsByComponent)

	for _, row := range raw {
		process := contracts.ProcessWithStep{
			ProcessID:     row.ProcessID,
			ProcessOrder:  row.ProcessOrder,
			ProcessStatus: row.ProcessStatus,
			ProcessNotes:  row.ProcessNotes,
			StepID:        row.StepID,
			StepName:      row.StepName,
			StepDesc:      row.StepDescription,
		}

		comp, exists := grouped[row.ComponentID]
		if !exists {
			comp = contracts.StepsByComponent{
				ComponentID:   row.ComponentID,
				ComponentName: row.ComponentName,
				Processes:     []contracts.ProcessWithStep{},
			}
		}
		comp.Processes = append(comp.Processes, process)
		grouped[row.ComponentID] = comp
	}

	// Converter o map em slice
	result := make([]contracts.StepsByComponent, 0, len(grouped))
	for _, comp := range grouped {
		result = append(result, comp)
	}

	return result, nil
}
