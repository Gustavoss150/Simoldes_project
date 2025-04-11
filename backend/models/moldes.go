package models

import (
	"time"
)

type ProcessStatus string

const (
	StatusNaoIniciado ProcessStatus = "not started"
	StatusEmProcesso  ProcessStatus = "in process"
	StatusConcluido   ProcessStatus = "completed"
)

type Moldes struct {
	Codigo       string        `gorm:"size:12;primaryKey" json:"codigo"` // Ex: "1678", "PROVA-A01"
	Description  string        `json:"description"`
	Status       ProcessStatus `gorm:"type:ENUM('not started','in process','completed');not null" json:"status"`
	Steps        int           `json:"steps,omitempty"` // Número de etapas do molde
	CurrentStep  int           `json:"current_step,omitempty"`
	BeginDate    time.Time     `json:"begin_date"`
	DeliveryDate time.Time     `json:"delivery_date"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
}

type Componentes struct {
	ID             string    `gorm:"primaryKey" json:"id"`
	MoldeCodigo    string    `gorm:"size:12;index" json:"molde_codigo"` // foreign key to Moldes
	Name           string    `json:"name"`
	Material       string    `json:"material"`
	Quantity       int       `json:"quantity"`
	Steps          int       `json:"steps,omitempty"`
	Status         bool      `json:"status"`                     // true para concluído
	Archive3DModel string    `json:"archive_3d_model,omitempty"` // URL or path to the 3D model file
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Processos struct {
	ID            string        `gorm:"size:12;primaryKey" json:"id"`
	MoldeCodigo   string        `gorm:"size:12;index" json:"molde_codigo"`   // foreign key to Moldes
	ComponentesID string        `gorm:"size:12;index" json:"componentes_id"` // foreign key to Componentes
	Description   string        `json:"description"`
	StepID        string        `gorm:"size:12;index" json:"step_id"`
	Status        ProcessStatus `gorm:"type:ENUM('not started','in process','completed');not null" json:"status"`
	MaquinaID     string        `gorm:"size:12;index" json:"maquina_id,omitempty"` // foreign key to Maquinas
	BeginDate     time.Time     `json:"begin_date"`
	DeliveryDate  time.Time     `json:"delivery_date"`
	Notes         string        `json:"notes,omitempty"`
	CreatedAt     time.Time     `json:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at"`
}

type Etapas struct {
	ID          string    `gorm:"size:12;primaryKey" json:"id"`
	Name        string    `json:"name"` // Ex: "Corte bruto", "Acabamento", etc.
	Description string    `json:"description"`
	Order       int       `json:"order"`     // Número da etapa na sequência
	IsActive    bool      `json:"is_active"` // Etapas descontinuadas, etc
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Maquinas struct {
	ID          string `gorm:"size:12;primaryKey" json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Type        string `json:"type"` // "Centro de Usinagem", "Fresa", "Torno" etc.
	Department  string `json:"department,omitempty"`
	IsActive    bool   `json:"is_active"`
}

type Programacoes struct {
	ID            string    `gorm:"size:12;primaryKey" json:"id"`              // corresponde a Referência na planilha
	MoldeCodigo   string    `gorm:"size:12;index" json:"molde_codigo"`         // foreign key to Moldes
	ComponentesID string    `gorm:"size:12;index" json:"componentes_id"`       // foreign key to Componentes
	MaquinaID     string    `gorm:"size:12;index" json:"maquina_id,omitempty"` // foreign key to Maquinas
	StepID        string    `gorm:"size:12;index" json:"step_id"`              // foreign key para Etapas
	Description   string    `json:"description,omitempty"`
	Date          time.Time `json:"date"`        // data da programação
	Programmer    string    `json:"programador"` // nome do programador
	UpdatedAt     time.Time `json:"updated_at"`
	Script        string    `json:"script,omitempty"` // URL or path to CNC script
}

type ChegadaAcos struct {
	ID            string    `gorm:"size:12;primaryKey" json:"id"`
	MoldeCodigo   string    `gorm:"size:12;index" json:"molde_codigo"`   // foreign key to Moldes
	ComponentesID string    `gorm:"size:12;index" json:"componentes_id"` // foreign key to Componentes
	Type          string    `json:"type"`                                // Tipo de aço
	Quantity      int       `json:"quantity"`                            // Quantidade recebida
	ArrivalDate   time.Time `json:"arrival_date"`                        // Data de chegada
	IsArrived     bool      `json:"is_arrived"`                          // true se o aço chegou
	Supplier      string    `json:"supplier"`                            // Fornecedor
}
