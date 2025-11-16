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
