# Pixel Pets – Manual Test Plan

## Environments
- Frontend: Vite dev server (http://localhost:5173)
- Backend: Spring Boot (http://localhost:8080)
- DB: MySQL 8.x (pixel_pets)

## Scenarios
1) Navigate all routes (Home, Dashboard, Pet Profile, Adopt)
2) Adopt pet (POST) → visible on Dashboard (GET)
3) Update pet stats (PUT) → reflects without full reload
4) Delete pet (DELETE) → removed from UI + DB
5) Validation: bad inputs show inline feedback; success → toast
6) Accessibility: alt text present; keyboard tab order OK
7) Responsive: ≤400px mobile, ~768px tablet, ≥1024px desktop
8) No runtime errors; no 404s; no console warnings
