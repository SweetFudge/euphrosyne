# jobFinder

Application de recherche d'offres d'emploi.

- `backend/` : API REST, Java 21, Spring Boot 3, Lombok, JPA/H2
- `frontend/` : React + TypeScript (TSX), Vite

## Démarrage

```bash
cd backend && mvn spring-boot:run     # API sur http://localhost:8080
cd frontend && npm install && npm run dev   # UI sur http://localhost:5173
```

Vite proxifie `/api` vers le backend.
