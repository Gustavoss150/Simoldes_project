package contracts

type UpdateMachRequest struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
	Type        *string `json:"type,omitempty"`
	Department  *string `json:"department,omitempty"`
}

type UpdateCNCProgramming struct {
	MaquinaID   *string `json:"maquina_id,omitempty"`
	StepID      *string `json:"step_id,omitempty"`
	Description *string `json:"description,omitempty"`
	Programmer  *string `json:"programador,omitempty"`
	Script      *string `json:"script,omitempty"`
}
