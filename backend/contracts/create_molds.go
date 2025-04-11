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
