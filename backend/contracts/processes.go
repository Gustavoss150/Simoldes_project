package contracts

import (
	"time"

	"github.com/Gustavoss150/simoldes-backend/models"
)

type CreateStepRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type CreateNewProcessRequest struct {
	ID           string               `json:"id,omitempty"`
	Description  string               `json:"description,omitempty"`
	StepID       string               `json:"step_id"`
	Status       models.ProcessStatus `json:"status"`
	MaquinaID    string               `json:"maquina_id,omitempty"`
	BeginDate    time.Time            `json:"begin_date"`
	DeliveryDate time.Time            `json:"delivery_date"`
	Notes        string               `json:"notes,omitempty"`
	Order        int                  `json:"order"`
}

type AddProcessToComponentDTO struct {
	Processos []CreateNewProcessRequest `json:"processos" binding:"required"`
}

type UpdateStepsRequest struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
}

type ProcessWithStep struct {
	ProcessID     string `json:"process_id"`
	ProcessOrder  int    `json:"order"`
	ProcessStatus string `json:"status"`
	ProcessNotes  string `json:"notes,omitempty"`
	StepID        string `json:"step_id"`
	StepName      string `json:"step_name"`
	MachineID     string `gorm:"column:maquina_id" json:"maquina_id"`
	MachineName   string `gorm:"column:maquina_name" json:"maquina_name"`
	StepDesc      string `json:"step_description"`
}

type StepsByComponent struct {
	ComponentID   string            `json:"component_id"`
	ComponentName string            `json:"component_name"`
	Processes     []ProcessWithStep `json:"processes"`
}

type InactiveStepsByComponent struct {
	ComponentID   string            `json:"component_id"`
	ComponentName string            `json:"component_name"`
	Processes     []ProcessWithStep `json:"processes"`
}
