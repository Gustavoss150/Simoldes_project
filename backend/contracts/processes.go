package contracts

type CreateStepRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
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
	StepDesc      string `json:"step_description"`
}

type StepsByComponent struct {
	ComponentID   string            `json:"component_id"`
	ComponentName string            `json:"component_name"`
	Processes     []ProcessWithStep `json:"processes"`
}
