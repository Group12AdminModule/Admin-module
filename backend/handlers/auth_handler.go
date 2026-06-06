package handlers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/config"
	"github.com/Group12AdminModule/Admin-module/backend/models"
	"github.com/Group12AdminModule/Admin-module/backend/utils"
)

type AuthHandler struct {
	db  *gorm.DB
	cfg config.Config
}

func NewAuthHandler(db *gorm.DB, cfg config.Config) *AuthHandler {
	return &AuthHandler{db: db, cfg: cfg}
}

type LoginRequest struct {
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=6"`
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request payload")
	}
	if strings.TrimSpace(req.Username) == "" || len(req.Password) < 6 {
		return fiber.NewError(fiber.StatusBadRequest, "validation failed")
	}

	var user models.User
	if err := h.db.Preload("Roles").Where("username = ? AND is_active = true", req.Username).First(&user).Error; err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid credentials")
	}
	if !utils.VerifyPassword(user.PasswordHash, req.Password) {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid credentials")
	}

	permissions := make([]string, 0)
	for _, role := range user.Roles {
		permissions = append(permissions, role.Permissions...)
	}

	accessToken, err := utils.GenerateToken(user.ID, permissions, h.cfg.JWTSecret, "access", h.cfg.AccessTokenMinutes)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed generating access token")
	}
	refreshToken, err := utils.GenerateToken(user.ID, permissions, h.cfg.RefreshSecret, "refresh", h.cfg.RefreshTokenMinutes)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed generating refresh token")
	}

	// Frontend integration: access token can be stored in memory, refresh token is an HttpOnly cookie.
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HTTPOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: "Strict",
		Path:     "/auth/refresh",
	})

	return c.JSON(fiber.Map{
		"access_token": accessToken,
		"token_type":   "Bearer",
		"expires_in":   h.cfg.AccessTokenMinutes * 60,
	})
}

func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "refresh token not found")
	}

	claims, err := utils.ParseToken(refreshToken, h.cfg.RefreshSecret, "refresh")
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "invalid refresh token")
	}

	accessToken, err := utils.GenerateToken(claims.UserID, claims.Permissions, h.cfg.JWTSecret, "access", h.cfg.AccessTokenMinutes)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed generating access token")
	}

	newRefresh, err := utils.GenerateToken(claims.UserID, claims.Permissions, h.cfg.RefreshSecret, "refresh", h.cfg.RefreshTokenMinutes)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed generating refresh token")
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    newRefresh,
		HTTPOnly: true,
		Secure:   h.cfg.CookieSecure,
		SameSite: "Strict",
		Path:     "/auth/refresh",
	})

	return c.JSON(fiber.Map{
		"access_token": accessToken,
		"token_type":   "Bearer",
		"expires_in":   h.cfg.AccessTokenMinutes * 60,
	})
}
