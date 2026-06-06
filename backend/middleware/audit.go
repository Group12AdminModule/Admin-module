package middleware

import (
	"log"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/models"
)

func AuditLogger(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		method := c.Method()
		if method != fiber.MethodPost && method != fiber.MethodPut && method != fiber.MethodDelete {
			return c.Next()
		}

		err := c.Next()

		if strings.HasPrefix(c.Path(), "/auth") {
			return err
		}

		var userID *uint
		if value := c.Locals("user_id"); value != nil {
			if id, ok := value.(uint); ok {
				userID = &id
			}
		}

		entry := models.AuditLog{
			UserID:   userID,
			Action:   method,
			Endpoint: c.OriginalURL(),
			Status:   c.Response().StatusCode(),
		}
		if createErr := db.Create(&entry).Error; createErr != nil {
			log.Printf("audit log create failed: %v", createErr)
		}
		return err
	}
}
