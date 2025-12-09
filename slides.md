# The Range — Presentation Deck

---
## Concept & Storyline
- Immersive browser‑based 3D aim training
- Progress through Beginner → Intermediate → Professional
- Educational goals: reflexes, accuracy, spatial awareness, decision‑making

---
## Target Area Relevance (XR/Game/3D Learning)
- Real‑time 3D rendering with Three.js
- Pointer‑lock controls, GLTF model, spatial audio
- Scaffolded learning via difficulty tiers
- Built for future WebXR extension

---
## Live Demo
- Backend: `npm run server` → http://localhost:3001
- Frontend: `npm run dev` → http://localhost:5173
- Sign up, log in, pick a level, play

---
## Architecture Overview
```
Vite/Three.js (5173) ── /api proxy ──► Express (3001) ──► PostgreSQL
Game scene & UI                      Auth & Scores        users, user_scores
```
- Frontend: game loop (`src/main.js`), UI (`src/manager.js`), target (`src/components/Target.js`), levels (`src/levels/*.js`)
- Backend: auth & scores (`server/index.js`), DB schema/queries (`server/db.js`)

---
## Tech Stack
- Frontend: Vite, Three.js, GLTFLoader, PointerLockControls
- Backend: Express, CORS, cookie‑parser, bcrypt, jsonwebtoken
- Database: PostgreSQL via `pg`
- Config/Testing: dotenv, Vitest, Supertest

---
## Gameplay Flow
1. Authenticated user enters hub
2. Select difficulty → pre‑game countdown
3. Aim & click to shoot; targets move toward player
4. HUD updates score/time/accuracy
5. End: timer or collision → post‑game summary

---
## Data Model
- `users(id, first_name, last_name, username, password_hash, created_at)`
- `user_scores(user_id, username, mode, best_score, updated_at)`
- Constraints & indices for integrity and performance

---
## Security & Best Practices
- Strong password rules and validation
- JWT in http‑only cookie
- Parameterized queries and transactions
- CORS + dev proxy separation

---
## Testing
- Unit (Vitest): UI and summary rendering
- API (Supertest): endpoints and error handling

---


## Team Roles

- Prince Johnard Gonzales (Backend & Database)

- Responsibilities: Express server architecture, API endpoint creation, PostgreSQL database schema design, authentication (JWT/Bcrypt), API security, and server-side testing

Ryan Ranada (Frontend & 3D Lead)

- Responsibilities: Three.js scene management, game loop logic, GLTF asset integration, UI/HUD implementation, client-side connectivity, and frontend testing (Vitest).

---
## Conclusion
The Range delivers a compelling 3D training environment with clean full‑stack architecture and strong technical practices. 

