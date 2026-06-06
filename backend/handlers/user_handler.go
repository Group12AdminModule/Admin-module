package handlers

import (
	"fmt"
	"net/mail"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/models"
	"github.com/Group12AdminModule/Admin-module/backend/utils"
)

type UserHandler struct {
	db *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{db: db}
}

type UserCreateRequest struct {
	Username string `json:"username" validate:"required,min=3"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	RoleIDs  []uint `json:"role_ids"`
}

type UserUpdateRequest struct {
	Email    *string `json:"email" validate:"omitempty,email"`
	Password *string `json:"password" validate:"omitempty,min=6"`
	IsActive *bool   `json:"is_active"`
	RoleIDs  []uint  `json:"role_ids"`
}

func (h *UserHandler) List(c *fiber.Ctx) error {
	page := utils.ParsePage(c.Query("page"), 1)
	pageSize := utils.ParsePage(c.Query("page_size"), 10)
	role := c.Query("role")
	offset := (page - 1) * pageSize

	query := h.db.Model(&models.User{}).Preload("Roles")
	if role != "" {
		query = query.Joins("JOIN user_roles ur ON ur.user_id = users.id").
			Joins("JOIN roles r ON r.id = ur.role_id").
			Where("r.name = ?", role)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed counting users")
	}

	var users []models.User
	if err := query.Limit(pageSize).Offset(offset).Find(&users).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed fetching users")
	}

	return c.JSON(fiber.Map{"data": users, "meta": fiber.Map{"page": page, "page_size": pageSize, "total": total}})
}

func (h *UserHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User
	if err := h.db.Preload("Roles").First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "failed fetching user")
	}
	return c.JSON(user)
}

func (h *UserHandler) Create(c *fiber.Ctx) error {
	var req UserCreateRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request payload")
	}
	if strings.TrimSpace(req.Username) == "" || len(req.Password) < 6 {
		return fiber.NewError(fiber.StatusBadRequest, "validation failed")
	}
	if _, err := mail.ParseAddress(req.Email); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "validation failed")
	}

	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed hashing password")
	}

	err = h.db.Transaction(func(tx *gorm.DB) error {
		user := models.User{Username: req.Username, Email: req.Email, PasswordHash: hash, IsActive: true}
		if err := tx.Create(&user).Error; err != nil {
			return err
		}
		if len(req.RoleIDs) > 0 {
			for _, roleID := range req.RoleIDs {
				if err := tx.Create(&models.UserRole{UserID: user.ID, RoleID: roleID}).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, fmt.Sprintf("failed creating user: %v", err))
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "user created"})
}

func (h *UserHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	var req UserUpdateRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request payload")
	}
	if req.Email != nil {
		if _, err := mail.ParseAddress(*req.Email); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "validation failed")
		}
	}
	if req.Password != nil && len(*req.Password) < 6 {
		return fiber.NewError(fiber.StatusBadRequest, "validation failed")
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := tx.First(&user, id).Error; err != nil {
			return err
		}

		updates := map[string]interface{}{}
		if req.Email != nil {
			updates["email"] = *req.Email
		}
		if req.IsActive != nil {
			updates["is_active"] = *req.IsActive
		}
		if req.Password != nil {
			hash, err := utils.HashPassword(*req.Password)
			if err != nil {
				return err
			}
			updates["password_hash"] = hash
		}
		if len(updates) > 0 {
			if err := tx.Model(&user).Updates(updates).Error; err != nil {
				return err
			}
		}

		if req.RoleIDs != nil {
			if err := tx.Where("user_id = ?", user.ID).Delete(&models.UserRole{}).Error; err != nil {
				return err
			}
			for _, roleID := range req.RoleIDs {
				if err := tx.Create(&models.UserRole{UserID: user.ID, RoleID: roleID}).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return fiber.NewError(fiber.StatusBadRequest, fmt.Sprintf("failed updating user: %v", err))
	}
	return c.JSON(fiber.Map{"message": "user updated"})
}

func (h *UserHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ?", id).Delete(&models.UserRole{}).Error; err != nil {
			return err
		}
		result := tx.Delete(&models.User{}, id)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}
		return nil
	})
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return fiber.NewError(fiber.StatusBadRequest, fmt.Sprintf("failed deleting user: %v", err))
	}
	return c.SendStatus(fiber.StatusNoContent)
}
