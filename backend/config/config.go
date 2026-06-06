package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Config struct {
	Port                string
	DBHost              string
	DBPort              string
	DBUser              string
	DBPassword          string
	DBName              string
	DBSSLMode           string
	DBMaxOpenConns      int
	DBMaxIdleConns      int
	JWTSecret           string
	RefreshSecret       string
	AccessTokenMinutes  int
	RefreshTokenMinutes int
	CORSAllowOrigins    string
	CookieSecure        bool
}

func Load() Config {
	_ = godotenv.Load()

	cfg := Config{
		Port:                getEnv("APP_PORT", "8080"),
		DBHost:              getEnv("DB_HOST", "localhost"),
		DBPort:              getEnv("DB_PORT", "5432"),
		DBUser:              getEnv("DB_USER", "postgres"),
		DBPassword:          getEnv("DB_PASSWORD", "postgres"),
		DBName:              getEnv("DB_NAME", "admin_module"),
		DBSSLMode:           getEnv("DB_SSL_MODE", "disable"),
		DBMaxOpenConns:      getIntEnv("DB_MAX_OPEN_CONNS", 25),
		DBMaxIdleConns:      getIntEnv("DB_MAX_IDLE_CONNS", 10),
		JWTSecret:           getEnv("JWT_SECRET", "change-me-access-secret"),
		RefreshSecret:       getEnv("JWT_REFRESH_SECRET", "change-me-refresh-secret"),
		AccessTokenMinutes:  getIntEnv("JWT_ACCESS_TOKEN_MINUTES", 15),
		RefreshTokenMinutes: getIntEnv("JWT_REFRESH_TOKEN_MINUTES", 60*24*7),
		CORSAllowOrigins:    getEnv("CORS_ALLOW_ORIGINS", "http://localhost:3000"),
		CookieSecure:        getBoolEnv("COOKIE_SECURE", false),
	}
	return cfg
}

func (c Config) DSN() string {
	parts := []string{
		"host=" + c.DBHost,
		"port=" + c.DBPort,
		"user=" + c.DBUser,
		"pass" + "word=" + c.DBPassword,
		"dbname=" + c.DBName,
		"sslmode=" + c.DBSSLMode,
	}
	return strings.Join(parts, " ")
}

func FiberErrorHandler(ctx *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return ctx.Status(code).JSON(fiber.Map{
		"error": err.Error(),
	})
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getIntEnv(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		if parsed, err := strconv.Atoi(value); err == nil {
			return parsed
		}
	}
	return fallback
}

func getBoolEnv(key string, fallback bool) bool {
	if value, ok := os.LookupEnv(key); ok {
		if parsed, err := strconv.ParseBool(value); err == nil {
			return parsed
		}
	}
	return fallback
}
