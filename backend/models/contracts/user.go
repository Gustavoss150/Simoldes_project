package contracts

type LoginRequest struct {
	Registration int    `json:"registration"`
	Password     string `json:"password"`
}
