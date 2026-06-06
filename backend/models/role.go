package models

import (
	"time"

	"github.com/lib/pq"
)

type Role struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"uniqueIndex;size:100;not null"`
	Permissions pq.StringArray `json:"permissions" gorm:"type:text[];not null;default:'{}'"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}
