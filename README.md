# 🚀 ConnectGo | Full-Stack Event Management System

![Spring Boot](https://img.shields.io/badge/Spring_Boot-F27336?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

ConnectGo is a **production-ready event management platform** featuring a cinematic **Netflix-style glassmorphic UI**.  
It allows users to **discover and book events** while providing administrators with a secure **JWT-authenticated suite** for event orchestration and attendee tracking.

---

# 🧠 Engineering Highlights

- **Secure Authentication:** Implemented **Spring Security with JWT** for stateless authorization, featuring distinct `ROLE_USER` and `ROLE_ADMIN` permissions.
- **Data Integrity:** Utilized **JPA Unique Constraints** on the `Registration` entity to prevent duplicate bookings at the database level.
- **Centralized Error Handling:** Integrated a `@RestControllerAdvice` global exception handler to standardize API responses and improve frontend resilience.
- **Modern Frontend:** Built with **React + Vite** for lightning-fast HMR, featuring custom CSS-in-JS glassmorphism, mobile responsiveness, and skeleton loaders.
- **Dockerized Ecosystem:** The entire stack (**Frontend, Backend, and MySQL**) is containerized for seamless **one-command deployment** via Docker Compose.

---

# ✨ Core Features

- **JWT Auth:** Secure Login/Register with password encryption.
- **Admin Bootstrap:** Automatic admin account creation on the first run.
- **Event Discovery:** Public listing with real-time capacity tracking (*Sold Out states*).
- **Management Suite:** Full CRUD operations for events (**Admin only**).
- **User Dashboard:** Personal registration tracking and management.
- **Attendee Overview:** Real-time feed of all event registrations for admins.

---

# 🛠️ Tech Stack

- **Frontend:** React, Vite, Axios, Context API, FontAwesome
- **Backend:** Java 17, Spring Boot, Spring Security, Spring Data JPA, Hibernate
- **Database:** MySQL 8
- **Documentation:** Swagger UI (OpenAPI 3)
- **DevOps:** Docker, Docker Compose

---

# 🏃 Getting Started

## Default Admin Credentials

- **Email:** `admin@connectgo.dev`
- **Password:** `Admin@123`

---

## 🐳 Full Docker Run (Recommended)

From the project root:

```bash
docker-compose up --build
```

Frontend:
```
http://localhost:5173
```

Backend:
```
http://localhost:8080
```

---

## 💻 Local Development

### 1. Start MySQL
Ensure a MySQL instance is running matching the `.env` configuration.

### 2. Run Backend

```bash
cd backend
mvn spring-boot:run
```

Swagger UI:
```
http://localhost:8080/swagger-ui.html
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🛰️ Main API Endpoints

| Method | Endpoint | Access |
|------|------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/events` | Public |
| POST | `/api/events` | **Admin** |
| DELETE | `/api/events/{id}` | **Admin** |
| POST | `/api/registrations/events/{eventId}` | User |
| GET | `/api/registrations/me` | User |
| GET | `/api/registrations` | **Admin** |

---

# 📸 Visual Showcase

<p align="center">
  <img src="images/home.png" width="45%" alt="Home Page" />
  <img src="images/dashboard.png" width="45%" alt="Dashboard" />
</p>

<p align="center">
  <img src="images/events.png" width="45%" alt="Event Listings" />
  <img src="images/login.png" width="45%" alt="Authentication" />
</p>

---

⭐ *Thank you for visiting.*
