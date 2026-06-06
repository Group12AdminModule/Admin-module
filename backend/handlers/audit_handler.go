package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/models"
	"github.com/Group12AdminModule/Admin-module/backend/utils"
)

type AuditHandler struct {
	db *gorm.DB
}

func NewAuditHandler(db *gorm.DB) *AuditHandler {
	return &AuditHandler{db: db}
}

func (h *AuditHandler) List(c *fiber.Ctx) error {
	page := utils.ParsePage(c.Query("page"), 1)
	pageSize := utils.ParsePage(c.Query("page_size"), 20)
	offset := (page - 1) * pageSize

	query := h.db.Model(&models.AuditLog{})
	if userID := c.Query("user_id"); userID != "" {
		query = query.Where("user_id = ?", userID)
	}
	if action := c.Query("action"); action != "" {
		query = query.Where("action = ?", action)
	}
	if start := c.Query("start"); start != "" {
		if parsed, err := time.Parse(time.RFC3339, start); err == nil {
			query = query.Where("created_at >= ?", parsed)
		}
	}
	if end := c.Query("end"); end != "" {
		if parsed, err := time.Parse(time.RFC3339, end); err == nil {
			query = query.Where("created_at <= ?", parsed)
		}
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed counting logs")
	}

	var logs []models.AuditLog
	if err := query.Order("created_at desc").Offset(offset).Limit(pageSize).Find(&logs).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed fetching logs")
	}

	return c.JSON(fiber.Map{"data": logs, "meta": fiber.Map{"page": page, "page_size": pageSize, "total": total}})
}
