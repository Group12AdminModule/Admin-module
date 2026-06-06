package models

import "time"

type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Username     string    `json:"username" gorm:"uniqueIndex;size:100;not null"`
	Email        string    `json:"email" gorm:"uniqueIndex;size:255;not null"`
	PasswordHash string    `json:"-" gorm:"column:password_hash;not null"`
	IsActive     bool      `json:"is_active" gorm:"default:true"`
	Roles        []Role    `json:"roles" gorm:"many2many:user_roles;"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
