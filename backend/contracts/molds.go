package contracts

import (
	"time"

	"github.com/Gustavoss150/simoldes-backend/models"
)

type CreateMoldRequest struct {
	Codigo       string               `json:"codigo"`
	Description  string               `json:"description"`
	Status       models.ProcessStatus `json:"status"`
	Steps        int                  `json:"steps,omitempty"`
	BeginDate    time.Time            `json:"begin_date"`
	DeliveryDate time.Time            `json:"delivery_date"`
}

type CreateComponentRequest struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Material       string `json:"material"`
	Quantity       int    `json:"quantity"`
	Steps          int    `json:"steps,omitempty"`
	Archive3DModel string `json:"archive_3d_model,omitempty"`
}

type CreateProcessRequest struct {
	ID            string               `json:"id,omitempty"`
	ComponentesID string               `json:"componentes_id"`
	Description   string               `json:"description,omitempty"`
	StepID        string               `json:"step_id"`
	StepName      string               `json:"step_name,omitempty"`
	Status        models.ProcessStatus `json:"status"`
	MaquinaID     string               `json:"maquina_id,omitempty"`
	BeginDate     time.Time            `json:"begin_date"`
	DeliveryDate  time.Time            `json:"delivery_date"`
	Notes         string               `json:"notes,omitempty"`
	Order         int                  `json:"order"`
}

type CreateMoldProjectRequest struct {
	Molde       CreateMoldRequest        `json:"molde"`
	Componentes []CreateComponentRequest `json:"componentes"`
	Processos   []CreateProcessRequest   `json:"processos"`
}

type CreateComponentsAndProcessesRequest struct {
	Componentes []CreateComponentRequest `json:"componentes"`
	Processos   []CreateProcessRequest   `json:"processos"`
}

type UpdateMoldOperationDTO struct {
	Description  *string               `json:"description"`
	Status       *models.ProcessStatus `json:"status"`
	Steps        *int                  `json:"steps,omitempty"`
	DeliveryDate *time.Time            `json:"delivery_date"`
}

type UpdateComponentOperationDTO struct {
	ComponenteID   string  `json:"componente_id"` // obrigatório para localizar o componente
	Quantity       *int    `json:"quantity,omitempty"`
	Steps          *int    `json:"steps,omitempty"`
	Status         *bool   `json:"status,omitempty"`
	Archive3DModel *string `json:"archive_3d_model,omitempty"`
	Material       *string `json:"material,omitempty"`
}

type UpdateProcessOperationDTO struct {
	ProcessoID    string  `json:"processo_id"`
	ComponentesID *string `json:"componentes_id,omitempty"`
	StepID        *string `json:"step_id,omitempty"`
	Status        *string `json:"status,omitempty"`
	Order         *int    `json:"order,omitempty"`
}

type UpdateMoldOperationRequest struct {
	Molde       *UpdateMoldOperationDTO       `json:"molde,omitempty"`
	Componentes []UpdateComponentOperationDTO `json:"componentes,omitempty"`
	Processos   []UpdateProcessOperationDTO   `json:"processos,omitempty"`
}
