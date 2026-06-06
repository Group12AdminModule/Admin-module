package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"

	"github.com/Group12AdminModule/Admin-module/backend/config"
	"github.com/Group12AdminModule/Admin-module/backend/middleware"
	"github.com/Group12AdminModule/Admin-module/backend/utils"
)

func TestJWTAuthValidToken(t *testing.T) {
	cfg := config.Config{JWTSecret: "test-secret"}
	token, err := utils.GenerateToken(1, []string{"users.read"}, cfg.JWTSecret, "access", 5)
	if err != nil {
		t.Fatalf("failed generating token: %v", err)
	}

	app := fiber.New()
	app.Get("/protected", middleware.JWTAuth(cfg), func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
}

func TestRequirePermissionForbidden(t *testing.T) {
	app := fiber.New()
	app.Get("/users", func(c *fiber.Ctx) error {
		c.Locals("permissions", []string{"roles.read"})
		return c.Next()
	}, middleware.RequirePermission("users.read"), func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	req := httptest.NewRequest(http.MethodGet, "/users", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("expected 403, got %d", resp.StatusCode)
	}
}
