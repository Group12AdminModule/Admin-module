package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"

	"github.com/Group12AdminModule/Admin-module/backend/config"
	"github.com/Group12AdminModule/Admin-module/backend/utils"
)

func JWTAuth(cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			return fiber.NewError(fiber.StatusUnauthorized, "missing bearer token")
		}

		token := strings.TrimPrefix(auth, "Bearer ")
		claims, err := utils.ParseToken(token, cfg.JWTSecret, "access")
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid token")
		}

		c.Locals("user_id", claims.UserID)
		c.Locals("permissions", claims.Permissions)
		return c.Next()
	}
}

func RequirePermission(required string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		permissions, ok := c.Locals("permissions").([]string)
		if !ok {
			return fiber.NewError(fiber.StatusForbidden, "permissions not found")
		}
		for _, permission := range permissions {
			if permission == required || permission == "*" {
				return c.Next()
			}
		}
		return fiber.NewError(fiber.StatusForbidden, "insufficient permissions")
	}
}
