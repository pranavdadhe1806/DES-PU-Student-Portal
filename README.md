# DES Unified Platform

> An all-in-one college portal exclusively for DES Pune University students and faculty — combining Google Classroom, WhatsApp, Discord, and GitHub Codespaces into a single platform locked to `@despuniversity.edu.in` emails.

---

## Project Structure

```
des-pu-student-portal/
├── frontend/    → Next.js 15 (App Router) — deploys to Vercel
└── backend/     → Node.js + Express + TypeScript — deploys to Render
```

---

## Running Locally

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL (Neon or local)
- Redis (Upstash or local)

---

### Frontend

```bash
cd frontend

# Copy environment variables
cp .env.example .env.local
# Fill in .env.local with your values

# Install dependencies
pnpm install

# Run dev server (http://localhost:3000)
pnpm dev
```

---

### Backend

```bash
cd backend

# Copy environment variables
cp .env.example .env
# Fill in .env with your values (DATABASE_URL, JWT_SECRET, REDIS_URL, etc.)

# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Run dev server (http://localhost:5000)
pnpm dev
```

---

## Tech Stack

| Layer | Frontend | Backend |
|---|---|---|
| Framework | Next.js 15 (App Router) | Express + TypeScript |
| Language | TypeScript | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui | — |
| State | Zustand | — |
| Data Fetching | TanStack Query v5 | — |
| Realtime | Socket.io client | Socket.io + Redis Adapter |
| Database | — | PostgreSQL (Prisma ORM) |
| Cache | — | Redis (Upstash) |
| File Storage | — | Cloudflare R2 |
| Job Queue | — | BullMQ |
| AI | — | Anthropic Claude API |

---

*Built by DES students, for DES students. 🔥*
