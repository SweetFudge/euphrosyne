# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Élégance Célébration" — a French event management website (weddings, private parties, anniversaries). The project is a monorepo with a separate Java backend and React frontend.

## Development Commands

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run          # Start API on port 8080
./mvnw clean package            # Build JAR
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
```

### Frontend (React + Vite)
```bash
cd frontend
npm install                     # Install dependencies
npm run dev                     # Dev server on port 5173
npm run build                   # Production build to dist/
npm run preview                 # Preview production build
```

### Database
```bash
docker-compose up -d            # Start MySQL on port 3306
```

### First-time setup
1. Copy `backend/src/main/resources/application.properties.example` → `application.properties` and fill in credentials.
2. Start MySQL via Docker, then start the backend (Hibernate auto-creates tables on first run via `ddl-auto=update`).
3. Start the frontend — Vite proxies `/api` and `/uploads` to `http://localhost:8080`.

## Architecture

### Backend (`backend/`)
Standard Spring Boot layered architecture:

```
controller/ → service/ → repository/ → model/
                              ↓
                           mapper/ (MapStruct)
                              ↓
                            dto/
```

- **model/** — JPA entities: `CatalogueItem`, `Category`, `Label`, `PortfolioItem`, `Reservation`, `ContactMessage`, `Newsletter`, `User`
- **dto/** — Request/response DTOs, decoupled from entities via MapStruct mappers in `mapper/`
- **security/** — Stateless JWT: `JwtTokenProvider` signs/validates tokens, `JwtAuthFilter` injects the `Authentication` into the security context per request
- **config/DataInitializer** — Creates the admin user on startup if it doesn't exist (credentials from `application.properties`)
- **config/WebMvcConfig** — Serves `uploads/` directory as static resources at `/uploads/**`

### Frontend (`frontend/src/`)
```
App.tsx           — Route definitions (public + admin)
context/          — AuthContext: JWT stored in localStorage, exposes useAuth()
services/api.ts   — Axios instance with base URL /api; JWT injected via request interceptor
services/         — One file per domain (catalogueService, reservationService, etc.)
pages/admin/      — Protected by PrivateRoute (redirects to /admin/login if unauthenticated)
components/       — Shared UI (Navbar, Footer, AdminLayout, ImageUploadInput, etc.)
```

Public routes use `PublicLayout` (Navbar + Footer wrapper). Admin routes are wrapped in `PrivateRoute` which checks `AuthContext.isAuthenticated`.

### API Security
All routes require a JWT `Authorization: Bearer <token>` header **except**:
- `POST /api/auth/login`
- `GET /api/portfolio`, `GET /api/catalogue`, `GET /api/labels`, `GET /api/categories`
- `POST /api/reservations`, `POST /api/newsletter/subscribe`, `POST /api/contacts`
- `GET /uploads/**`

### Design System
TailwindCSS with a custom palette defined in `frontend/tailwind.config.js`. Key tokens:
- `primary` = `#745b00`, `primary-container` = `#d5af37`, `background` / `surface` = `#fcf9f3`
- Fonts: `font-headline` = Noto Serif, `font-body` / `font-label` = Manrope

Always use these semantic color tokens — never raw hex values in components.

### File Uploads
- Frontend sends multipart form via `uploadService.ts` → `POST /api/upload`
- Backend stores files in the `uploads/` directory (project root, gitignored)
- Files are served publicly at `/uploads/<filename>`
