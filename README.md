# ConnectGo

ConnectGo is a full-stack event management system built with React, Spring Boot, and MySQL. The original repository link you shared was unavailable, so this workspace was scaffolded as a complete production-style replacement with the requested stack.

## Stack

- Frontend: React + Vite + React Router + Axios
- Backend: Spring Boot + Spring Security + JWT + Spring Data JPA
- Database: MySQL 8
- Docs: Swagger UI
- Containers: Docker Compose

## Features

- JWT authentication with admin and user roles
- Admin bootstrap account on first run
- Public event listing
- Admin event creation, update, and deletion APIs
- User event registration
- Personal registration dashboard
- Admin attendee overview
- Dockerized frontend, backend, and database

## Project structure

- [backend](backend)
- [frontend](frontend)
- [docker-compose.yml](docker-compose.yml)

## Default credentials

- Admin email: `admin@connectgo.dev`
- Admin password: `Admin@123`

## Local development

### 1. Start MySQL

Use Docker:

```bash
docker compose up mysql -d
```

Or run a local MySQL instance matching [.env.example](.env.example).

### 2. Run the backend

From [backend](backend):

```bash
mvn spring-boot:run
```

Backend URL: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui.html

### 3. Run the frontend

From [frontend](frontend):

```bash
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## Full Docker run

From the project root:

```bash
docker compose up --build
```

## Main API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/{id}`
- `POST /api/events` (admin)
- `PUT /api/events/{id}` (admin)
- `DELETE /api/events/{id}` (admin)
- `POST /api/registrations/events/{eventId}`
- `GET /api/registrations/me`
- `GET /api/registrations` (admin)

## Environment

Copy [.env.example](.env.example) and adjust as needed for local deployment.