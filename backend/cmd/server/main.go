package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/Group12AdminModule/Admin-module/backend/config"
	"github.com/Group12AdminModule/Admin-module/backend/database"
	"github.com/Group12AdminModule/Admin-module/backend/routes"
)

func main() {
	cfg := config.Load()
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	if err := database.Initialize(db); err != nil {
		log.Fatalf("failed to initialize database: %v", err)
	}

	app := fiber.New(fiber.Config{
		AppName:      "Admin Module API",
		ErrorHandler: config.FiberErrorHandler,
	})

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSAllowOrigins,
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
	}))

	routes.Register(app, db, cfg)

	log.Printf("server listening on :%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
