package contracts

import (
	"time"

	"github.com/Gustavoss150/simoldes-backend/models"
)

type CreateMoldRequest struct {
	Codigo       string               `json:"codigo"`
	Description  string               `json:"description"`
	Status       models.ProcessStatus `json:"status"`
	BeginDate    time.Time            `json:"begin_date"`
	DeliveryDate time.Time            `json:"delivery_date"`
}

type CreateComponentRequest struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Material       string `json:"material"`
	Quantity       int    `json:"quantity"`
	Archive3DModel string `json:"archive_3d_model,omitempty"`
}

type CreateProcessRequest struct {
	ID            string               `json:"id"`
	ComponentesID string               `json:"componentes_id"`
	Description   string               `json:"description"`
	StepID        string               `json:"step_id"`
	StepName      string               `json:"step_name"`
	Status        models.ProcessStatus `json:"status"`
	MaquinaID     string               `json:"maquina_id,omitempty"`
	BeginDate     time.Time            `json:"begin_date"`
	DeliveryDate  time.Time            `json:"delivery_date"`
	Notes         string               `json:"notes,omitempty"`
}

type CreateMoldProjectRequest struct {
	Molde       CreateMoldRequest        `json:"molde"`
	Componentes []CreateComponentRequest `json:"componentes"`
	Processos   []CreateProcessRequest   `json:"processos"`
}

type UpdateComponentOperationDTO struct {
	ComponenteID   string `json:"componente_id"`
	Quantity       *int   `json:"quantity,omitempty"`
	Archive3DModel string `json:"archive_3d_model,omitempty"`
	Material       string `json:"material,omitempty"`
}

type UpdateProcessOperationDTO struct {
	ProcessoID    string `json:"processo_id"`
	ComponentesID string `json:"componentes_id"`
	StepID        string `json:"step_id"`
	Status        string `json:"status"`
}

type UpdateMoldOperationRequest struct {
	MoldeCodigo string                        `json:"molde_codigo"`
	Componentes []UpdateComponentOperationDTO `json:"componentes,omitempty"`
	Processos   []UpdateProcessOperationDTO   `json:"processos,omitempty"`
}
