package handlers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/models"
)

type RoleHandler struct {
	db *gorm.DB
}

func NewRoleHandler(db *gorm.DB) *RoleHandler {
	return &RoleHandler{db: db}
}

type CreateRoleRequest struct {
	Name        string   `json:"name" validate:"required,min=2"`
	Permissions []string `json:"permissions"`
}

func (h *RoleHandler) List(c *fiber.Ctx) error {
	var roles []models.Role
	if err := h.db.Find(&roles).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed fetching roles")
	}
	return c.JSON(fiber.Map{"data": roles})
}

func (h *RoleHandler) Create(c *fiber.Ctx) error {
	var req CreateRoleRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request payload")
	}
	if strings.TrimSpace(req.Name) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "validation failed")
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		role := models.Role{Name: req.Name, Permissions: pq.StringArray(req.Permissions)}
		return tx.Create(&role).Error
	})
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "failed creating role")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "role created"})
}
