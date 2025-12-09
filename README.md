# The Range — 3D Aim Training & Virtual Learning Experience

## Project Story & Concept
The Range is an immersive 3D aim‑training experience built for the browser. You enter a virtual firing range as a trainee and progress through Beginner, Intermediate, and Professional scenarios. Each session blends reflex training, spatial awareness, and decision‑making under time pressure. It provides instant feedback through accuracy, score, and achievements, turning deliberate practice into an engaging learning loop.

Educational goals:
- Build hand–eye coordination and reaction time
- Improve spatial reasoning and target prioritization
- Encourage data‑driven self‑assessment with high‑scores and post‑game analytics

## Relevance to XR/Game/3D Learning
- Uses real‑time 3D rendering to simulate a training range with dynamic targets
- Pointer‑lock controls, physics‑like motion, collision checks, spatial audio
- Structured difficulty tiers that scaffold learning from fundamentals to mastery
- Designed for future WebXR integration to extend to VR headsets

## Features
- Three difficulty modes with tuned target count, speed, and timing
- Realistic GLTF weapon, background textures, and multi‑instance audio
- Authenticated sessions with JWT cookies and personal high‑scores
- Live HUD: score, timer, accuracy; post‑game achievements and summary
- Resilient asset loading with progress UI and graceful fallbacks

## Architecture
Full‑stack, modular design with clear separation of concerns:
- Frontend (Vite + Three.js)
  - `src/main.js`: game loop, input, shooting, collisions, scoring
  - `src/manager.js`: UIManager for HUD, loading screen, toasts, post‑game overlay
  - `src/components/Target.js`: target lifecycle, movement, collision
  - `src/levels/*.js`: difficulty configs (Beginner/Intermediate/Professional)
  - `index.html` + `public/*`: static assets (textures, model, audio, CSS)
- Backend (Express)
  - `server/index.js`: auth, score APIs, cookie/JWT handling, CORS
  - `server/db.js`: PostgreSQL pool, schema init, queries, upsert best scores
- Database (PostgreSQL)
  - `users`: identity and password hash
  - `user_scores`: best score per difficulty with constraints and indices

Runtime topology:
```
Browser (Vite dev server 5173) ── proxy /api ──► Express (3001) ──► PostgreSQL
         Three.js scene & UI                Auth & Scores      users, user_scores
```

## Schemas
CREATE TABLE IF NOT EXISTS public.users (

id BIGSERIAL PRIMARY KEY,
first_name TEXT NOT NULL,
last_name TEXT NOT NULL,
username TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE public.user_scores (
    username TEXT,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('Beginner','Intermediate','Professional')),
    best_score INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, mode)
);

SELECT * FROM public.users;

SELECT * FROM public.user_scores;

TRUNCATE TABLE public.user_scores; 
TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;


## Development Stack
- Frontend: Vite, Three.js, PointerLockControls, GLTFLoader
- Backend: Express, CORS, cookie‑parser, bcrypt, jsonwebtoken
- Database: PostgreSQL (`pg`), schema migrations at startup
- Configuration: `.env` via `dotenv`
- Testing: Vitest (unit), Supertest (API)

## Setup & Installation
Prerequisites:
- `Node.js` 18+
- `PostgreSQL` 13+

Steps:
1. Create database: `The-Range-1`
2. Copy or edit `.env`:
   - `PGHOST=localhost`
   - `PGPORT=5432`
   - `PGDATABASE=The-Range-1`
   - `PGUSER=postgres`
   - `PGPASSWORD=your_password`
   - Optional: `JWT_SECRET=change-me-in-prod`
3. Install dependencies:
   - `npm install`
4. Start backend:
   - `npm run server` (starts `http://localhost:3001`)
5. Start frontend:
   - `npm run dev` (opens `http://localhost:5173` with `/api` proxied)
6. Sign up, log in, pick a level, and play.


## API Overview
- `POST /api/auth/signup` → create account (server‑side validation)
- `POST /api/auth/login` → set `auth_token` http‑only cookie
- `POST /api/auth/logout` → clear cookie
- `GET /api/auth/me` → current user from JWT
- `GET /api/scores/me` → best scores for authenticated user
- `POST /api/scores/update` → upsert best score per difficulty

## Team Roles
- Prince Johnard Gonzales (Backend & Database)

- Responsibilities: Express server architecture, API endpoint creation, PostgreSQL database schema design, authentication (JWT/Bcrypt), API security, and server-side testing

Ryan Ranada (Frontend & 3D Lead)

- Responsibilities: Three.js scene management, game loop logic, GLTF asset integration, UI/HUD implementation, client-side connectivity, and frontend testing (Vitest).

## Security & Best Practices
- Strong password policy and server‑side validation
- JWT in secure, http‑only cookie with limited lifetime
- Parameterized queries and transaction use for schema init
- CORS and proxy separation between client and server




