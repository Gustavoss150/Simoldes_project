package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint64         `gorm:"primaryKey" json:"id"` // Agora o JSON usa "id" (minúsculo)
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Registration int            `gorm:"uniqueIndex" json:"registration"`
	Name         string         `json:"name"`
	Password     string         `gorm:"not null" json:"password"`
	Role         string         `json:"role"`
	Department   string         `json:"department,omitempty"`
	IsActive     bool           `gorm:"default:true" json:"is_active"`
}
