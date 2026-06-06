package models

type UserRole struct {
	UserID uint `json:"user_id" gorm:"primaryKey"`
	RoleID uint `json:"role_id" gorm:"primaryKey"`
}

func (UserRole) TableName() string {
	return "user_roles"
}
