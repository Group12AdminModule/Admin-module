package database

import (
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/config"
	"github.com/Group12AdminModule/Admin-module/backend/models"
)

func Connect(cfg config.Config) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxOpenConns(cfg.DBMaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.DBMaxIdleConns)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	return db, nil
}

func Initialize(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.Role{},
		&models.UserRole{},
		&models.AuditLog{},
	)
}
