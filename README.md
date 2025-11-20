Here’s the updated README with all the tweaks folded in and the seed-data note assuming no `data.sql` file.

---

# 🐾 Pixel Pets

**Pixel Pets** is a retro-style virtual pet game where players adopt pixelated cats, dogs, and dragons, keep them fed, happy, and rested, and watch their stats change over time. Built as a full-stack capstone project with a **React + Vite** frontend and a **Spring Boot + MySQL** backend, Pixel Pets lets users create accounts, adopt pets, and interact with them via **Feed / Play / Rest** actions, while the backend tracks **time-based stat decay** so pets feel more alive—even when the user is away.

---

## 🎮 Status & Links

`status: submitted for LaunchCode capstone review` · `frontend: React + Vite` · `backend: Spring Boot (Java 21)`
`database: MySQL` · `deployment: Netlify + Elastic Beanstalk`

* **Live App (Netlify)**: [https://pixelpets.netlify.app/](https://pixelpets.netlify.app/)
* **Source Code (GitHub)**: [https://github.com/skperry99/pixel-pets.git](https://github.com/skperry99/pixel-pets.git)

---

## 🧰 Tech Stack

### Frontend

* **React** (Vite SPA)
* **React Router** (`react-router-dom`)
* **Custom CSS** (retro 8-bit theme, pixel borders, responsive layout)
* **Accessibility-minded UI**

  * Inline form errors
  * Toast notifications
  * Focus management on errors and dialogs
* **canvas-confetti** (lazy-loaded for celebratory effects)

### Backend

* **Java 21**
* **Spring Boot 3.x**

  * `spring-boot-starter-web` — REST API
  * `spring-boot-starter-data-jpa` — JPA / Hibernate
  * `spring-boot-starter-validation` — Bean validation
  * `spring-boot-starter-security` — password hashing (BCrypt) & future auth
* **MySQL 8+** (relational database)
* **Lombok** — reduces boilerplate for entities
* **Maven** — build & dependency management
* **Spotless + Checkstyle** — formatting & style checks

---

## 🐉 Core Features

### 👤 User Accounts

* Register with **username, email, password**
* Log in and persist session via a **localStorage `userId`**
* Edit profile (username + email)
* Change password
* Delete account with:

  * **Type-to-confirm** (`DELETE`)
  * Cascade deletion of that user’s pets

### 🐾 Virtual Pets

* Adopt pets with a **name** and **type** (Cat / Dog / Dragon)
* View all pets on a **Dashboard grid**
* View a **Pet Profile** page with:

  * Animated pixel sprite (or emoji fallback)
  * Status bars for **Fullness, Happiness, Energy**
  * Mood messages when stats drop too low

### ⚙️ Interactions & Game Logic

* **Feed** → boosts fullness
* **Play** → boosts happiness (and triggers confetti 🎉)
* **Rest** → restores energy
* All interactions call backend REST endpoints and return updated stats.
* **Time-based stat decay**:

  * Each pet stores a `lastTickAt` timestamp.
  * On each interaction, elapsed time is used to **decay stats** gradually.
  * Values are clamped between 0 and 100.

### 🎨 UI / UX & Fun Extras

* 8-bit **pixel UI**:

  * Grid background
  * Chunky pixel panels & buttons
  * Pixel “corner nubs” and CRT-style details
* Fully responsive layout:

  * Desktop nav with centered title
  * Mobile hamburger menu + dropdown
* Inline **form errors** + toast notifications
* **404 page** with a pixel ghost mascot 👻
* **Konami code** easter egg → theme toggle + confetti
* Theme toggle (`theme-cola`, `theme-gb`, `theme-sunset`, etc.)

---

## 🏗 Project Structure

At a high level, the repo is organized as:

```text
pixel-pets/
  backend/        # Spring Boot / Java 21 application
  frontend/       # React + Vite SPA
```

* **Backend** config: `backend/pom.xml`, `application.properties`, profile files in `src/main/resources`.
* **Frontend** config: `frontend/package.json`, `vite.config.*`, `.eslintrc`, `.prettierrc`, etc.

---

## 💻 Getting Started (Local Development)

These steps assume you want to run **both backend and frontend locally**.

### ✅ Prerequisites

* **Java 21+**
* **Maven** (for building & running Spring Boot)
* **Node.js 20+**
* **npm** (or compatible package manager)
* **MySQL 8+**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/skperry99/pixel-pets.git
cd pixel-pets
```

---

### 2️⃣ Backend Setup (Spring Boot + MySQL)

#### 2.1 Create Database & User

In MySQL, create the database and user. You can either:

**Option A – Use the provided local credentials**

```sql
CREATE DATABASE pixel_pets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'pixel_user'@'localhost' IDENTIFIED BY 'Pixel123!';
GRANT ALL PRIVILEGES ON pixel_pets.* TO 'pixel_user'@'localhost';
FLUSH PRIVILEGES;
```

The default local configuration expects:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pixel_pets?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=pixel_user
spring.datasource.password=Pixel123!
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Option B – Use your own credentials**

Update `backend/src/main/resources/application.properties`
or create `application-local.properties` (which is `.gitignored`) with your values:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pixel_pets?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

The production profile (`application-prod.properties`) uses environment variables like:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

for deployment.

#### 2.2 Run the Backend

From the **backend** directory:

```bash
cd backend
mvn spring-boot:run
```

By default, the backend starts on:
**[http://localhost:8080](http://localhost:8080)**

Key REST endpoints (all under `/api`):

* `POST   /api/auth/register`
* `POST   /api/auth/login`
* `GET    /api/users/{id}`
* `PUT    /api/users/{id}`
* `DELETE /api/users/{id}`
* `GET    /api/pets/user/{userId}`
* `GET    /api/pets/{id}`
* `POST   /api/pets/adopt`
* `POST   /api/pets/{id}/feed`
* `POST   /api/pets/{id}/play`
* `POST   /api/pets/{id}/rest`
* `DELETE /api/pets/{id}`

#### 2.3 Seed Data (Users & Pets)

No SQL seed scripts are required to run Pixel Pets locally.

1. Start the backend (Step 2.2).
2. Start the frontend (Step 3.2).
3. In the UI, click **Register** to create a new account.
4. Use the **Dashboard** to adopt a pet and start interacting with it.

> If you prefer to add your own seed data, you can insert rows directly into the `users` and `pets` tables once the schema has been created by Hibernate.

---

### 3️⃣ Frontend Setup (React + Vite)

From the **frontend** directory:

```bash
cd ../frontend
npm install
```

#### 3.1 Environment Variable

Create a `.env` in `frontend/` (or adjust an existing one):

```bash
VITE_API_BASE=http://localhost:8080
```

> If `VITE_API_BASE` is not set, the frontend will **default** to `http://localhost:8080`
> (see `src/api.js`), but the env var keeps it explicit.

#### 3.2 Run the Frontend Dev Server

```bash
npm run dev
```

Vite will start on:
**[http://localhost:5173](http://localhost:5173)**

Open the app in your browser and log in or register a new account.
The frontend uses `VITE_API_BASE` for all `/api/...` requests.

---

### 🔧 Configuration Summary

For local development, you’ll need:

**Backend (Spring Boot)**

Either:

* `backend/src/main/resources/application.properties` using the default local values:

  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/pixel_pets?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
  spring.datasource.username=pixel_user
  spring.datasource.password=Pixel123!
  spring.jpa.hibernate.ddl-auto=update
  ```

Or:

* A local override file (e.g., `application-local.properties`, which is `.gitignored`) with your own values.

For production-like deployments, the backend reads:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

from environment variables.

**Frontend (Vite + React)**

* `.env` in the `frontend/` folder with:

  ```bash
  VITE_API_BASE=http://localhost:8080
  ```

If this is not set, the app defaults to `http://localhost:8080` in `src/api.js`.

---

### 🔑 API Keys

Pixel Pets does **not** use any third-party APIs, so no external API keys are required.

---

## 🧩 Architecture Overview

### Backend

* **Entities**

  * `User` and `Pet` as JPA entities mapped to `users` and `pets` tables.
  * `User` ↔ `Pet`: one-to-many relationship.
  * `Pet` includes:

    * `fullness`, `happiness`, `energy` (0–100)
    * `lastTickAt` for time-based stat decay
* **Service Layer**

  * Applies **decay logic** based on elapsed time since `lastTickAt`.
  * Clamps values to stay within `[0, 100]`.
* **Controller Layer**

  * Exposes **REST endpoints** and uses DTOs (`UserDto`, `PetDto`).
  * Avoids exposing password hashes and internal DB fields directly.

### Frontend

* **Routing**

  * `/` — Landing page
  * `/login` — Log in
  * `/register` — Create account
  * `/dashboard` — User’s pets + adopt form
  * `/settings` — Profile & password settings
  * `/pets/:petId` — Pet Profile
  * `*` — 404 Not Found
* **App Shell**

  * `AppLayout` provides NavBar, main content, and Footer.
* **State & Data Fetching**

  * `localStorage` stores a numeric `userId`.
  * `src/api.js` provides a **unified `request` helper** returning `{ ok, status, data, error }`.
* **UI State & Feedback**

  * `NoticeProvider` + `useNotice()` for pixel-style toasts.
  * Inline form validation with accessible error messages.
  * `ErrorBoundary` wraps the app to show a friendly fallback if something crashes.
  * `ConfirmDialog` / `ConfirmAction` components for destructive actions.

---

## 🗺️ Wireframes & ERD

These design artifacts show how the app was planned before implementation.

* **Wireframes (screens & layout)**
  [https://docs.google.com/presentation/d/1qlAJlDn2_v8Zz3L9VdwpnAsAHd_PqHQRKcwbZHhSmmE/edit?usp=drive_link](https://docs.google.com/presentation/d/1qlAJlDn2_v8Zz3L9VdwpnAsAHd_PqHQRKcwbZHhSmmE/edit?usp=drive_link)

* **ERD (Entity Relationship Diagram)**
  [https://docs.google.com/presentation/d/13dbNaNI-6SwyrJSFdLaZajFOUuJ16FoRXIglG_MccTc/edit?usp=drive_link](https://docs.google.com/presentation/d/13dbNaNI-6SwyrJSFdLaZajFOUuJ16FoRXIglG_MccTc/edit?usp=drive_link)

> **Future:** Export these to PNG/SVG and check them into the repo under
> `docs/wireframes/` and `docs/erd/` for easier offline viewing.

---

## 🐛 Unsolved Problems

These are areas that are intentionally simplified or not fully complete:

* **Authentication depth**

  * Login uses localStorage with a `userId` only.
  * In a production app, this would be replaced with **JWT** or session-based auth and locked-down endpoints.
* **Stat tuning & balancing**

  * Decay rates and action boosts are tuned to “feel good” for a demo, but haven’t been play-tested or optimized.

---

## 🚀 Future Features

Some ideas for where Pixel Pets could go next:

1. **Achievements & Pet History**

   * New `PetEvent` table to track feed/play/rest events.
   * Achievements for streaks (e.g., “Fed daily for 7 days”).
   * Timeline or tiny chart on the Pet Profile page.     
2. **Pet Customization**

   * Pick colors, accessories, or alternate sprite sets.
   * Unlock cosmetics based on achievements or pet level.
3. **Social / Shared Features**

   * Optional friend codes or leaderboards (e.g., “happiest pet this week”).
   * Extra care taken around privacy and moderation.     
4. **Improved Auth & Security**

   * Replace local `userId` with real tokens (JWT/OAuth2).
   * Role-based features (e.g., admin tools, moderation dashboard).

---

## 🤝 Extensibility (For Other Developers)

If another developer wants to build on this project, some natural entry points:

* **Backend**

  * Add new REST endpoints under `/api/pets` or `/api/users`.
  * Extend the data model with `PetEvent`, `Achievement`, or inventory tables.
  * Integrate JWT/OAuth2 and tighten Spring Security rules.
* **Frontend**

  * Add new pages/routes (`/about`, `/help`, `/achievements`, etc.).
  * Introduce more nuanced responsive layouts (pet collections, timelines, charts).
  * Build reusable UI components for cards, lists, and dialogs.

---

## 💛 Acknowledgements

Huge thanks to the **LaunchCode** staff, mentors, and fellow learners for feedback,
encouragement, and late-night debugging help throughout this capstone.

Pixel Pets was built as part of the **LaunchCode Full-Stack Web Developer** program —
and is proudly powered by **caffeine, curiosity, and 8-bit nostalgia**. ☕🕹️

---

## 📜 License

This project was created as a **LaunchCode Full-Stack Capstone Project**.
Please contact the author before using it for commercial purposes.

---

Made with 💛 by **Sarah** — because every pixel deserves a little love. 🐾
