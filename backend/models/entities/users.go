package entities

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model          // gorm adiciona campos padrão: ID, CreatedAt, UpdatedAt, DeletedAt (não usar nas próximas)
	Registration int    `gorm:"uniqueIndex" json:"registration"` // Matrícula
	Name         string `json:"name"`                            // Nome do usuário
	Password     string `json:"-"`                               // Nunca expor a senha no JSON
	Role         string `json:"role"`                            // "user", "admin"
	Department   string `json:"department,omitempty"`            // Setor do usuário
	IsActive     bool   `gorm:"default:true" json:"is_active"`   // Ativo ou não
}
