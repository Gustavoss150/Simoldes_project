package contracts

import (
	"time"

	"github.com/Gustavoss150/simoldes-backend/models"
)

type ImportMoldDTO struct {
	Codigo       string                `json:"codigo" binding:"required"`
	Description  *string               `json:"description,omitempty"`
	Status       *models.ProcessStatus `json:"status,omitempty"`
	BeginDate    *time.Time            `json:"begin_date,omitempty"`
	DeliveryDate *time.Time            `json:"delivery_date,omitempty"`
	IsActive     *bool                 `json:"is_active,omitempty"`
}

type ImportComponentDTO struct {
	ID             string  `json:"id" binding:"required"`
	MoldeCodigo    string  `json:"molde_codigo" binding:"required"`
	Name           *string `json:"name,omitempty"`
	Material       *string `json:"material,omitempty"`
	Quantity       *int    `json:"quantity,omitempty"`
	Archive3DModel *string `json:"archive_3d_model,omitempty"`
	IsActive       *bool   `json:"is_active,omitempty"`
}

type ImportProcessDTO struct {
	ID            *string               `json:"id,omitempty"`
	MoldeCodigo   string                `json:"molde_codigo" binding:"required"`
	ComponentesID *string               `json:"componente_id,omitempty"`
	StepID        *string               `json:"step_id,omitempty"`
	Status        *models.ProcessStatus `json:"status,omitempty"`
	MaquinaID     *string               `json:"maquina_id,omitempty"`
	BeginDate     *time.Time            `json:"begin_date,omitempty"`
	DeliveryDate  *time.Time            `json:"delivery_date,omitempty"`
	Notes         *string               `json:"notes,omitempty"`
	Order         *int                  `json:"order,omitempty"`
	IsActive      *bool                 `json:"is_active,omitempty"`
}

type ImportSteelArrivalDTO struct {
	ID            *string    `json:"id,omitempty"`
	MoldeCodigo   string     `json:"molde_codigo" binding:"required"`
	ComponentesID string     `json:"componentes_id" binding:"required"`
	Type          *string    `json:"type,omitempty"`
	Quantity      *int       `json:"quantity,omitempty"`
	ArrivalDate   *time.Time `json:"arrival_date,omitempty"`
	Supplier      *string    `json:"supplier,omitempty"`
	IsArrived     *bool      `json:"is_arrived,omitempty"`
	IsActive      *bool      `json:"is_active,omitempty"`
}

type ImportProgrammingDTO struct {
	ID           *string    `json:"id,omitempty"`
	MoldeCodigo  string     `json:"molde_codigo" binding:"required"`
	ProcessID    *string    `json:"process_id,omitempty"`
	ComponenteID *string    `json:"componente_id,omitempty"`
	MaquinaID    *string    `json:"maquina_id,omitempty"`
	Programmer   *string    `json:"programador,omitempty"`
	Script       *string    `json:"script,omitempty"`
	CreatedAt    *time.Time `json:"created_at,omitempty"`
	IsActive     *bool      `json:"is_active,omitempty"`
}
