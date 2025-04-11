package contracts

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
