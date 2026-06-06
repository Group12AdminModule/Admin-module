package handlers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/models"
)

type DashboardHandler struct {
	db *gorm.DB
}

func NewDashboardHandler(db *gorm.DB) *DashboardHandler {
	return &DashboardHandler{db: db}
}

func (h *DashboardHandler) Get(c *fiber.Ctx) error {
	var userCount int64
	var roleCount int64
	var auditCount int64

	if err := h.db.Model(&models.User{}).Count(&userCount).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed fetching user stats")
	}
	if err := h.db.Model(&models.Role{}).Count(&roleCount).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed fetching role stats")
	}
	if err := h.db.Model(&models.AuditLog{}).Count(&auditCount).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed fetching audit stats")
	}

	return c.JSON(fiber.Map{
		"users":      userCount,
		"roles":      roleCount,
		"audit_logs": auditCount,
	})
}
