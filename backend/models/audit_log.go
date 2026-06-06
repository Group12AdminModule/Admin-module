package models

import "time"

type AuditLog struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    *uint     `json:"user_id" gorm:"index"`
	Action    string    `json:"action" gorm:"size:20;not null"`
	Endpoint  string    `json:"endpoint" gorm:"size:255;not null"`
	Status    int       `json:"status" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}
