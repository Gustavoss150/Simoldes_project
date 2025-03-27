package contracts

type LoginRequest struct {
	Registration int    `json:"registration"`
	Password     string `json:"password"`
}

type UpdateUserRequest struct {
	Name       *string `json:"name,omitempty"`
	Password   *string `json:"password,omitempty"`
	Department *string `json:"department,omitempty"`
}
