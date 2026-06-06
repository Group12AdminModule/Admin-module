# Go Backend (Fiber + PostgreSQL)

Production-ready backend for the React Admin Module with JWT auth, RBAC, and audit logging.

## Run

```bash
cd backend
go mod tidy
go run ./cmd/server
```

## Database Schema

Run `backend/db/schema.sql` in PostgreSQL, or let GORM auto-migrate on startup.

## API Endpoints

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /roles`
- `POST /roles`
- `GET /audit-logs`
- `GET /dashboard`

Send the access token as a JWT in the `Authorization` header for protected routes.
