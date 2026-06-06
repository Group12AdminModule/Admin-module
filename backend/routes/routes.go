package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/Group12AdminModule/Admin-module/backend/config"
	"github.com/Group12AdminModule/Admin-module/backend/handlers"
	"github.com/Group12AdminModule/Admin-module/backend/middleware"
)

func Register(app *fiber.App, db *gorm.DB, cfg config.Config) {
	authHandler := handlers.NewAuthHandler(db, cfg)
	userHandler := handlers.NewUserHandler(db)
	roleHandler := handlers.NewRoleHandler(db)
	auditHandler := handlers.NewAuditHandler(db)
	dashboardHandler := handlers.NewDashboardHandler(db)

	app.Get("/health", func(c *fiber.Ctx) error { return c.SendString("ok") })

	auth := app.Group("/auth")
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.Refresh)

	api := app.Group("/", middleware.JWTAuth(cfg), middleware.AuditLogger(db))

	api.Get("/users", middleware.RequirePermission("users.read"), userHandler.List)
	api.Get("/users/:id", middleware.RequirePermission("users.read"), userHandler.GetByID)
	api.Post("/users", middleware.RequirePermission("users.write"), userHandler.Create)
	api.Put("/users/:id", middleware.RequirePermission("users.write"), userHandler.Update)
	api.Delete("/users/:id", middleware.RequirePermission("users.delete"), userHandler.Delete)

	api.Get("/roles", middleware.RequirePermission("roles.read"), roleHandler.List)
	api.Post("/roles", middleware.RequirePermission("roles.write"), roleHandler.Create)

	api.Get("/audit-logs", middleware.RequirePermission("audit.read"), auditHandler.List)
	api.Get("/dashboard", middleware.RequirePermission("dashboard.read"), dashboardHandler.Get)
}
