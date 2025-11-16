Here’s a `README.md` version styled more like that image—title, subtitle, badges, emoji section headers, and clean sections you can drop straight into your repo:

````markdown
# 🐾 Pixel Pets

_A retro-style virtual pet game built with React & Spring Boot_

[![status](https://img.shields.io/badge/status-capstone%20complete-ffcc00)]()
[![frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb)]()
[![backend](https://img.shields.io/badge/backend-Spring%20Boot-6db33f)]()
[![database](https://img.shields.io/badge/database-MySQL-4479a1)]()
[![deployment](https://img.shields.io/badge/deploy-Netlify-00ad9f)]()

---

## 🎮 Elevator Pitch

Pixel Pets is a retro-style virtual pet game where users can **adopt pixel pals**, keep them **fed, happy, and rested**, and watch their stats change over time.

It’s built as a full-stack capstone project with a **React + Vite** frontend and a **Spring Boot + MySQL** backend. Players can create accounts, adopt pets, and interact with them via **Feed / Play / Rest** actions. Behind the scenes, the backend tracks **time-based stat decay** so pets feel more alive—even when the user is away.

---

## 🔗 Live Demo & Source

- **Live App (Netlify)**: https://pixelpets.netlify.app/  
- **Source Code (GitHub)**: https://github.com/skperry99/pixel-pets.git  

---

## 🧩 Tech Stack

### Frontend

- **React** (Vite)
- **React Router** (`react-router-dom`)
- **Custom CSS** (retro 8-bit theme, responsive layout)
- **Accessibility-minded UI** (toasts, inline errors, focus management)
- **`canvas-confetti`** (lazy-loaded for celebratory effects)

### Backend

- **Java 21**
- **Spring Boot 3.x**
  - `spring-boot-starter-web` – REST API
  - `spring-boot-starter-data-jpa` – JPA / Hibernate
  - `spring-boot-starter-validation` – Bean validation
  - `spring-boot-starter-security` – password hashing & future auth
- **MySQL** – relational database
- **Lombok** – boilerplate reduction for entities
- **Maven** – build & dependency management
- **Spotless + Checkstyle** – formatting & style checks

---

## 🐕 Core Features

### 👤 User Accounts

- Register a new account with **username, email, and password**
- Log in and persist a session via **`localStorage` userId**
- Edit profile (username & email)
- Change password
- Delete account (with type-to-confirm and cascade delete of pets)

### 🐾 Virtual Pets

- Adopt new pets with name + type (e.g., **Cat / Dog / Dragon**)
- View all your pets on a **dashboard grid**
- View a **Pet Profile** with:
  - Animated pixel sprite or emoji fallback
  - Status bars for **Fullness, Happiness, Energy**
  - “Mood” messages when stats get low

### ⚙️ Interactions & Game Logic

- **Feed** – increases fullness  
- **Play** – boosts happiness (and triggers confetti)  
- **Rest** – restores energy  
- All actions go through backend **REST endpoints** and return updated stats  
- **Time-based stat decay** using a `lastTickAt` timestamp so pets gradually lose stats when you’re away

### 🖥️ UI / UX & Extras

- 8-bit **pixel UI theme** with grid background, chunky panels, and pixel borders
- Fully responsive **navigation + layout**:
  - Desktop nav with centered title
  - Mobile hamburger menu & dropdown
- Inline **form errors** + toast notifications for success/failure
- Fun touches:
  - 404 page with a pixel ghost
  - **Konami code** easter egg (GameBoy-style theme + confetti)
  - Theme variants in the UI (`theme-cola`, `theme-gb`, `theme-sunset`, etc.)

---

## 🧱 Architecture Overview

### Backend

- `User` and `Pet` JPA entities map to `users` and `pets` tables
- **Relationships**
  - One **User** → many **Pets**
- **Pet** includes:
  - `fullness`, `happiness`, `energy` (0–100)
  - `lastTickAt` timestamp for time-based stat decay
- **Service layer**
  - Applies decay based on elapsed time since `lastTickAt`
  - Clamps all stat values between 0 and 100
- **Controller layer**
  - Exposes REST endpoints
  - Uses DTOs (`UserDto`, `PetDto`) so DB details and password hashes are not exposed

### Frontend

- **Routes**: `/`, `/login`, `/register`, `/dashboard`, `/settings`, `/pets/:petId`, and a 404 route
- **App shell**: `AppLayout` with `NavBar`, `main` content, and `Footer`
- **State & data**
  - `localStorage` stores `userId`
  - Components fetch data through a centralized `api.js` helper
- **UI state & feedback**
  - `NoticeProvider` + `useNotice()` for pixel-style toasts
  - Inline form validation + accessible error messages
  - `ErrorBoundary` wraps the app and shows a friendly fallback if something crashes

---

## 🛠️ Getting Started (Local Development)

These steps assume you want to run **both backend and frontend locally**.

### ✅ Prerequisites

- **Java 21+**
- **Maven** (for building/running Spring Boot)
- **Node.js 20+**
- **npm** (or compatible package manager)
- **MySQL 8+**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/skperry99/pixel-pets.git
cd pixel-pets
````

---

### 2️⃣ Backend Setup (Spring Boot + MySQL)

#### 2.1. Create Database & User

In MySQL, create the database and user.

**Option A – Use the provided local credentials**

```sql
CREATE DATABASE pixel_pets
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'pixel_user'@'localhost' IDENTIFIED BY 'Pixel123!';
GRANT ALL PRIVILEGES ON pixel_pets.* TO 'pixel_user'@'localhost';
FLUSH PRIVILEGES;
```

**Option B – Use your own credentials**

Update `backend/src/main/resources/application.properties` or add an `application-local.properties`
(which is `.gitignored`) with your own values, for example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pixel_pets?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> The production profile (`application-prod.properties`) uses environment variables like
> `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` for deployment.

#### 2.2. Run the Backend

From the `backend` directory:

```bash
cd backend
mvn spring-boot:run
```

The backend starts on **[http://localhost:8080](http://localhost:8080)** and exposes REST endpoints such as:

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET  /api/users/{id}`
* `PUT  /api/users/{id}`
* `DELETE /api/users/{id}`
* `GET  /api/pets/user/{userId}`
* `GET  /api/pets/{id}`
* `POST /api/pets/adopt`
* `POST /api/pets/{id}/feed`
* `POST /api/pets/{id}/play`
* `POST /api/pets/{id}/rest`
* `DELETE /api/pets/{id}`

---

### 3️⃣ Frontend Setup (React + Vite)

From the `frontend` directory:

```bash
cd ../frontend
npm install
```

#### 3.1. Environment Variable

Create a `.env` file in `frontend/` (or adjust an existing one):

```bash
VITE_API_BASE=http://localhost:8080
```

If `VITE_API_BASE` is not set, the frontend defaults to `http://localhost:8080` in `api.js`, but the env var keeps it explicit.

#### 3.2. Run the Frontend Dev Server

```bash
npm run dev
```

Vite will start on **[http://localhost:5173](http://localhost:5173)**.

Open the app in your browser:

* [http://localhost:5173](http://localhost:5173)

The frontend calls the backend using `VITE_API_BASE` for all `/api/...` requests.

---

## 🗺️ Wireframes & ERD

These design artifacts show how the app was planned before implementation.

* **Wireframes (screens & layout)**
  [https://docs.google.com/presentation/d/1qlAJlDn2_v8Zz3L9VdwpnAsAHd_PqHQRKcwbZHhSmmE/edit?usp=drive_link](https://docs.google.com/presentation/d/1qlAJlDn2_v8Zz3L9VdwpnAsAHd_PqHQRKcwbZHhSmmE/edit?usp=drive_link)

* **ERD (Entity Relationship Diagram)**
  [https://docs.google.com/presentation/d/13dbNaNI-6SwyrJSFdLaZajFOUuJ16FoRXIglG_MccTc/edit?usp=drive_link](https://docs.google.com/presentation/d/13dbNaNI-6SwyrJSFdLaZajFOUuJ16FoRXIglG_MccTc/edit?usp=drive_link)

*In the future, these can be exported to images (PNG/SVG) and checked into the repo under something like `docs/wireframes/` and `docs/erd/` for easier offline viewing.*

---

## 🚧 Unsolved Problems / Current Limitations

* **Authentication depth**
  Login currently uses a stored `userId` in `localStorage`. A production version would use real authentication (JWT tokens or sessions) and secure, restricted endpoints.

* **Stat tuning & balancing**
  Decay rates and action boosts are set to “feel good” for a demo but haven’t been rigorously play-tested or balanced.

* **Error handling**
  Many API errors are surfaced as toasts and inline messages, but there’s room for:

  * Centralized error logging
  * Retry logic for transient network issues

* **Accessibility polish**
  ARIA roles and focus management are in place in key forms and notices, but a full accessibility audit (screen reader flows, keyboard-only navigation, high-contrast themes) is still future work.

---

## 🌱 Future Feature Ideas

1. **Achievements & Pet History**

   * New `PetEvent` table to track feed/play/rest actions
   * Achievements for streaks (e.g., “Fed daily for 7 days”)
   * Timeline or simple chart on the Pet Profile page

2. **Pet Customization**

   * Choose colors, accessories, or different sprite sets
   * Unlock cosmetics based on stats or achievements

3. **Multiple Worlds / Rooms**

   * Different backgrounds or “areas” (home, park, training gym)
   * Areas could influence stat changes differently

4. **Social / Shared Features**

   * Optional friend codes or shared leaderboards
   * Designed with privacy and moderation in mind

5. **Improved Auth & Security**

   * Replace simple local `userId` with real auth tokens
   * Role-based features (admin tools, moderation, etc.)

---

## 🧑‍💻 How Other Developers Can Extend It

Good entry points if you’d like to build on Pixel Pets:

### Backend

* Add new REST endpoints under `/api/pets` or `/api/users`
* Extend the data model (e.g., `PetEvent`, `Achievement` entities) and update the ERD
* Integrate JWT or OAuth2 for more robust authentication

### Frontend

* Add new pages/routes (e.g., `/about`, `/help`, `/achievements`)
* Enhance mobile experience and refine responsive layouts
* Create reusable UI components for cards, lists, and dialogs

---

## 📜 License & Credits

This project was created as a **LaunchCode Full-Stack Capstone Project**.
Please contact the author before using it for commercial purposes.

Made with 💛 by **Sarah** — because **every pixel deserves a little love.** 🐾

```
::contentReference[oaicite:0]{index=0}
```
