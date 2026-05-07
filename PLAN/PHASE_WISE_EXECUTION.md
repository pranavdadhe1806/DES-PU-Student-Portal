# DES Unified Platform — Backend Phase-Wise Execution Plan

> **Scope:** `backend/` only  
> **Stack:** Node.js + Express + TypeScript + Prisma + PostgreSQL (Neon) + Redis (Upstash) + Cloudflare R2 + BullMQ + Socket.io + Anthropic Claude  
> **Rules from PLAN.md (non-negotiable):**
> - Never block the event loop — CPU-heavy work → BullMQ queue
> - All handlers stateless — sessions in Redis, files in R2, never on disk
> - No N+1 queries — always use Prisma `include`
> - Indexes on every FK and every WHERE/ORDER BY field
> - Every external call has a timeout (5s max)
> - Global error handler — nothing crashes the process
> - Route handlers respond in under 100ms

---

## Phase 1 — Foundation (Week 1)

**Goal:** Server boots, DB is connected, auth works end-to-end, all infra wired up.

### 1.1 — Express App Entry Point (`src/index.ts`)

Wire up the full Express app:
- dotenv/config loaded first
- Prisma client instantiated and connected
- Redis client connected (`src/cache/redis.ts`)
- Middleware stack: `helmet()` → `cors()` → `morgan()` → `express.json()` → `cookieParser()`
- Rate limiter: strict on `/auth/*`, loose globally
- All route files mounted under `/api/v1/`
- Socket.io server attached (`src/socket.ts`)
- Global error handler registered last
- Graceful shutdown on SIGTERM: close DB + Redis

**Files to implement:**
- `src/index.ts` — full app bootstrap
- `src/cache/redis.ts` — ioredis singleton export `redis`
- `src/utils/index.ts` — `paginate()`, `formatApiError()`, `asyncHandler()` wrapper

### 1.2 — Prisma Schema (Full DB Design)

Design the complete schema **before writing any route**. Lock it in Phase 1.

**Models to write in `prisma/schema.prisma`:**

```prisma
// --- Identity ---
model User {
  id             String         @id @default(cuid())
  email          String         @unique
  passwordHash   String
  username       String         @unique
  fullName       String
  role           Role           @default(STUDENT)
  department     String
  semester       Int
  rollNumber     String
  bio            String?
  avatarUrl      String?
  presenceStatus PresenceStatus @default(OFFLINE)
  isBanned       Boolean        @default(false)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  @@index([email])
  @@index([role])
  @@index([department, semester])
}

enum Role { STUDENT FACULTY ADMIN CONTRIBUTOR PROJECT_LEADER }
enum PresenceStatus { ONLINE OFFLINE AWAY }

// --- Academic Structure ---
model Department { id String @id @default(cuid()); name String; code String @unique }
model Semester   { id String @id @default(cuid()); number Int; departmentId String; @@index([departmentId]) }
model Subject    { id String @id @default(cuid()); name String; code String; semesterId String; facultyId String?; @@index([semesterId]) }
model Enrollment { id String @id @default(cuid()); userId String; subjectId String; @@unique([userId, subjectId]); @@index([userId]) }

// --- Forums ---
model Post {
  id        String   @id @default(cuid())
  content   String
  authorId  String
  subjectId String?
  parentId  String?
  type      PostType @default(DISCUSSION)
  isPinned  Boolean  @default(false)
  isLocked  Boolean  @default(false)
  upvotes   Int      @default(0)
  tags      String[]
  createdAt DateTime @default(now())
  @@index([subjectId])
  @@index([authorId])
  @@index([parentId])
  @@index([createdAt])
}
enum PostType { DISCUSSION ANNOUNCEMENT QUESTION RESOURCE }
model PostUpvote   { userId String; postId String; @@id([userId, postId]) }
model PostBookmark { userId String; postId String; @@id([userId, postId]) }

// --- Resources ---
model Resource {
  id            String   @id @default(cuid())
  name          String
  r2Key         String   @unique
  mimeType      String
  fileSize      Int
  subjectId     String
  uploadedById  String
  downloadCount Int      @default(0)
  isTopperNote  Boolean  @default(false)
  thumbnailKey  String?
  createdAt     DateTime @default(now())
  @@index([subjectId])
  @@index([uploadedById])
}

// --- Chat ---
model Conversation {
  id        String           @id @default(cuid())
  type      ConversationType @default(DIRECT)
  name      String?
  createdAt DateTime         @default(now())
}
enum ConversationType { DIRECT GROUP }
model ConversationMember { conversationId String; userId String; @@id([conversationId, userId]); @@index([userId]) }
model Message {
  id             String   @id @default(cuid())
  content        String
  senderId       String
  conversationId String
  readBy         String[]
  createdAt      DateTime @default(now())
  @@index([conversationId])
  @@index([senderId])
  @@index([createdAt])
}

// --- Notifications ---
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  data      Json
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  @@index([userId, read])
  @@index([createdAt])
}

// --- Projects ---
model Project {
  id          String        @id @default(cuid())
  title       String
  description String
  leaderId    String
  status      ProjectStatus @default(OPEN)
  openRoles   String[]
  skills      String[]
  createdAt   DateTime      @default(now())
  @@index([leaderId])
  @@index([status])
}
enum ProjectStatus { OPEN IN_PROGRESS COMPLETED }
model ProjectMember      { projectId String; userId String; role String @default("MEMBER"); @@id([projectId, userId]) }
model ProjectApplication { id String @id @default(cuid()); projectId String; userId String; message String; status String @default("PENDING"); @@index([projectId]); @@index([userId]) }

// --- Gamification ---
model XpEvent { id String @id @default(cuid()); userId String; points Int; reason String; createdAt DateTime @default(now()); @@index([userId]) }
model Badge   { id String @id @default(cuid()); userId String; type String; awardedAt DateTime @default(now()); @@index([userId]) }
```

Run after writing:
```bash
pnpm prisma:migrate
```

### 1.3 — Infrastructure Connections

**`src/cache/redis.ts`**
- Single `ioredis` client from `REDIS_URL`
- Export `redis` singleton
- Log errors, never crash on Redis unavailability

**`src/socket.ts`**
- Create `Server` from `socket.io`
- Apply `@socket.io/redis-adapter` using `redis.duplicate()`
- Export `io` singleton
- Each user joins personal room = their `userId` on connect

### 1.4 — Auth System

**Middleware:**

`src/middleware/domainCheck.middleware.ts`
- Check `email.endsWith('@despuniversity.edu.in')` → 403 if not

`src/middleware/auth.middleware.ts`
- Read JWT from `req.cookies.token`
- Verify with `JWT_SECRET`
- Attach to `req.user`
- 401 if missing/invalid/expired

`src/middleware/rbac.middleware.ts`
- Factory: `rbac(['ADMIN', 'FACULTY'])`
- 403 if `req.user.role` not in allowed array

`src/middleware/rateLimit.middleware.ts`
- `authLimiter`: 5 req/min → applied to `/api/v1/auth/*`
- `defaultLimiter`: 200 req/min → applied globally

**Endpoints:**
```
POST /api/v1/auth/register   → domainCheck → register
POST /api/v1/auth/login      → login
POST /api/v1/auth/logout     → authenticate → logout
GET  /api/v1/auth/me         → authenticate → me
```

**`src/services/auth.service.ts`:**
- `register`: validate domain, argon2.hash, prisma.user.create, auto-enroll in subjects
- `login`: find user, argon2.verify, sign JWT, set HTTP-only cookie
- `logout`: clear cookie
- `me`: prisma.user.findUnique with badges

### 1.5 — User Routes

```
GET   /api/v1/users/:id          → authenticate → getProfile
PATCH /api/v1/users/:id          → authenticate → updateProfile (username, bio, avatarUrl only)
GET   /api/v1/users/:id/badges   → authenticate → getBadges
```

---

## Phase 2 — Classroom Layer (Week 2)

**Goal:** Academic structure seeded, forums working, file uploads to R2 working, queues active.

### 2.1 — Academic Structure

**`prisma/seed.ts`:** Seed Departments → Semesters → Subjects from a JSON fixture.

Auto-enrollment in `auth.service.ts → register`:
- After user creation, find all Subjects for `department + semester`
- Bulk create `Enrollment` records

**Endpoints:**
```
GET /api/v1/academic/departments
GET /api/v1/academic/departments/:id/semesters
GET /api/v1/academic/semesters/:id/subjects
GET /api/v1/academic/my-subjects   → authenticate
```

Cache subject lists in Redis: key `subjects:{deptId}:{semester}`, TTL 1h.

### 2.2 — Discussion Forums

```
GET    /api/v1/forums/:subjectId/posts
POST   /api/v1/forums/:subjectId/posts
GET    /api/v1/forums/posts/:postId
POST   /api/v1/forums/posts/:postId/reply
PATCH  /api/v1/forums/posts/:postId/upvote
PATCH  /api/v1/forums/posts/:postId/pin       → rbac([FACULTY, ADMIN])
PATCH  /api/v1/forums/posts/:postId/lock      → rbac([FACULTY, ADMIN])
DELETE /api/v1/forums/posts/:postId
POST   /api/v1/forums/posts/:postId/bookmark
```

**`src/services/forum.service.ts`:**
- `getPosts`: paginated, include author (no N+1), sorted by `createdAt DESC`
- `createPost`: create Post → add `auto-tag` job to `aiSummary.queue` → add XP job to `notifications.queue`
- `toggleUpvote`: upsert PostUpvote → update `Post.upvotes` → add XP queue job
- Never call Claude API inline from service

### 2.3 — File Uploads to Cloudflare R2

**`src/services/storage.service.ts`:**
- `uploadFile(key, buffer, contentType)`: `PutObjectCommand` to R2
- `getPresignedUrl(key, expiresIn)`: `getSignedUrl` with `GetObjectCommand`
- `deleteFile(key)`: `DeleteObjectCommand`
- R2 endpoint: `https://{ACCOUNT_ID}.r2.cloudflarestorage.com`

**`src/routes/resources.routes.ts`:**
```
GET    /api/v1/resources/:subjectId
POST   /api/v1/resources/:subjectId/upload   → multer memory → upload
GET    /api/v1/resources/:id/download-url    → presigned URL
DELETE /api/v1/resources/:id
GET    /api/v1/resources/my-space
PATCH  /api/v1/resources/:id/topper          → rbac([FACULTY, ADMIN])
```

**`src/services/resources.service.ts` → `uploadResource`:**
1. Key: `resources/{subjectId}/{cuid()}-{filename}`
2. `storage.uploadFile(key, buffer, mimetype)`
3. `prisma.resource.create`
4. Add job to `fileProcessing.queue`
5. Return `{ status: 'processing', resourceId }`

Multer: `memoryStorage()`, max 50MB, types: pdf, doc, docx, ppt, pptx, zip, jpg, png.

### 2.4 — BullMQ Workers

**`src/queues/workers/fileProcessing.worker.ts`:**
- Image → Sharp thumbnail (400px) → upload to R2 → update Resource.thumbnailKey
- PDF → extract page count → update Resource
- Emit `resource:processed` via Socket.io to uploader

**`src/queues/workers/aiSummary.worker.ts`:**
- `auto-tag` job → call `ai.service.suggestTags` → update Post.tags
- `summarize-thread` job → call `ai.service.summarizeThread` → store in Redis → emit via Socket.io

**`src/queues/workers/notifications.worker.ts`:**
- Create Notification in DB
- Emit `notification:new` via `io.to(userId)`

---

## Phase 3 — Chat & Social Layer (Week 3)

**Goal:** Real-time messaging, presence, notifications, badges, XP.

### 3.1 — Real-Time Chat

**REST (history only):**
```
GET  /api/v1/chat/conversations
GET  /api/v1/chat/conversations/:id
POST /api/v1/chat/conversations
POST /api/v1/chat/groups
POST /api/v1/chat/groups/:id/members
```

**Socket.io events:**
```
Client → chat:message  { conversationId, content }
Server → chat:message  to all conversation members
Client → chat:typing   { conversationId }
Server → chat:typing   to others in conversation
Client → chat:read     { conversationId, messageId }
Server → chat:read     to sender
```

**`src/services/chat.service.ts`:**
- `sendMessage`: persist Message → emit → queue notification for OFFLINE members

### 3.2 — Presence System

In `src/socket.ts`:
- On connect: `SETEX presence:{userId} 300 "ONLINE"` in Redis + update DB
- On disconnect: delete key + set DB OFFLINE + emit `presence:update`
- Client emits `presence:away` → set AWAY

### 3.3 — Notifications

```
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
PATCH /api/v1/notifications/read-all
```

Notification types: `REPLY`, `UPVOTE`, `MENTION`, `CHAT_MESSAGE`, `ANNOUNCEMENT`, `RESOURCE_PROCESSED`

### 3.4 — Gamification

New file: **`src/services/gamification.service.ts`**
- `awardXp(userId, points, reason)`: insert XpEvent → check badge thresholds
- `checkAndAwardBadge(userId)`: if threshold met → insert Badge → notify user

XP triggers (always via queue jobs, never inline):

| Action | XP |
|---|---|
| Post created | +10 |
| Reply upvoted | +5 |
| Resource uploaded | +15 |
| Resource marked Topper Note | +50 |

Badge rules:
- `CONTRIBUTOR`: 5+ resources uploaded
- `TOP_HELPER`: 50+ upvotes received
- `TOPPER_NOTES`: has a topper-note resource
- `PROJECT_LEADER`: created a project

Leaderboard: cached in Redis key `leaderboard:{department}`, TTL 1h.

---

## Phase 4 — Projects + AI + Deploy (Week 4)

**Goal:** Full feature set shipped, AI active with circuit breaker, deployed to Render.

### 4.1 — Project Marketplace

```
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id                       → leader only
POST   /api/v1/projects/:id/apply
GET    /api/v1/projects/:id/applications          → leader only
PATCH  /api/v1/projects/:id/applications/:appId  → accept/reject
DELETE /api/v1/projects/:id
```

`acceptApplication`: create ProjectMember + auto-create GROUP Conversation for team + notify applicant.

### 4.2 — AI Features

**`src/services/ai.service.ts`:**
- `suggestTags(content)`: Claude API → string[]
- `summarizeThread(posts)`: Claude API → TL;DR string
- `recommendProjects(userSkills, projects)`: Claude API → ranked project IDs

**Circuit breaker (Redis-based):**
```ts
const failures = await redis.incr('ai:failures')
if (failures >= 5) {
  await redis.setex('ai:circuit_open', 30, '1')
}
const open = await redis.get('ai:circuit_open')
if (open) return null // skip Claude call
```

All Claude calls happen only inside BullMQ workers, never in route handlers.

### 4.3 — Admin Routes

```
GET    /api/v1/admin/reports
PATCH  /api/v1/admin/reports/:id
PATCH  /api/v1/admin/users/:id/ban
PATCH  /api/v1/admin/users/:id/role
GET    /api/v1/admin/audit-logs
```

All guarded by `rbac(['ADMIN'])`.

### 4.4 — Production Hardening

**`src/middleware/errorHandler.ts`** (new):
```ts
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})
```

**Timeouts on all external calls:**
- Prisma: `connection_timeout` in DATABASE_URL query param
- Redis: `connectTimeout: 5000` in ioredis options
- Claude API: `AbortSignal.timeout(5000)`

**Process-level safety:**
```ts
process.on('unhandledRejection', (err) => { console.error(err); gracefulShutdown() })
process.on('uncaughtException', (err) => { console.error(err); gracefulShutdown() })
```

**Upgrade rate limiter to Redis-backed** (replace in-memory store with `rate-limit-redis`).

### 4.5 — CI/CD

**`.github/workflows/backend.yml`:**
```yaml
on:
  push:
    paths: ['backend/**']
    branches: [main]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: cd backend && pnpm install
      - run: cd backend && pnpm type-check
      - run: cd backend && pnpm build
      - name: Deploy to Render
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## File Creation Checklist

### Phase 1
- [ ] `src/cache/redis.ts`
- [ ] `src/utils/index.ts`
- [ ] `prisma/schema.prisma` (full schema — lock before Phase 2)
- [ ] `prisma/seed.ts`
- [ ] `src/middleware/domainCheck.middleware.ts`
- [ ] `src/middleware/auth.middleware.ts`
- [ ] `src/middleware/rbac.middleware.ts`
- [ ] `src/middleware/rateLimit.middleware.ts`
- [ ] `src/middleware/errorHandler.ts` ← new
- [ ] `src/services/auth.service.ts`
- [ ] `src/controllers/auth.controller.ts` ← new
- [ ] `src/routes/auth.routes.ts`
- [ ] `src/services/user.service.ts` ← new
- [ ] `src/controllers/user.controller.ts` ← new
- [ ] `src/routes/user.routes.ts`
- [ ] `src/socket.ts`
- [ ] `src/index.ts`

### Phase 2
- [ ] `src/services/storage.service.ts`
- [ ] `src/services/forum.service.ts`
- [ ] `src/controllers/forum.controller.ts` ← new
- [ ] `src/routes/forum.routes.ts`
- [ ] `src/services/resources.service.ts` ← new
- [ ] `src/controllers/resources.controller.ts` ← new
- [ ] `src/routes/resources.routes.ts`
- [ ] `src/queues/fileProcessing.queue.ts`
- [ ] `src/queues/aiSummary.queue.ts`
- [ ] `src/queues/notifications.queue.ts`
- [ ] `src/queues/workers/fileProcessing.worker.ts` ← new
- [ ] `src/queues/workers/aiSummary.worker.ts` ← new
- [ ] `src/queues/workers/notifications.worker.ts` ← new

### Phase 3
- [ ] `src/services/chat.service.ts`
- [ ] `src/controllers/chat.controller.ts` ← new
- [ ] `src/routes/chat.routes.ts`
- [ ] `src/services/notification.service.ts`
- [ ] `src/controllers/notifications.controller.ts` ← new
- [ ] `src/routes/notifications.routes.ts`
- [ ] `src/services/gamification.service.ts` ← new

### Phase 4
- [ ] `src/services/projects.service.ts`
- [ ] `src/controllers/projects.controller.ts` ← new
- [ ] `src/routes/projects.routes.ts`
- [ ] `src/services/ai.service.ts`
- [ ] `src/services/admin.service.ts`
- [ ] `src/controllers/admin.controller.ts` ← new
- [ ] `src/routes/admin.routes.ts`
- [ ] `.github/workflows/backend.yml` ← new

---

## Redis Key Conventions

| Key | Value | TTL | Purpose |
|---|---|---|---|
| `session:{userId}` | JSON user | 7d | Auth session cache |
| `presence:{userId}` | `ONLINE`/`AWAY` | 5min | Presence heartbeat |
| `subjects:{deptId}:{sem}` | JSON array | 1h | Subject list cache |
| `leaderboard:{department}` | JSON array | 1h | XP leaderboard |
| `thread-summary:{postId}` | TL;DR string | 24h | AI thread summary |
| `ai:failures` | Integer | — | Circuit breaker counter |
| `ai:circuit_open` | `"1"` | 30s | Circuit breaker flag |

---

## Consistent API Response Shape

```ts
// Success
{ data: T, meta?: { page: number, limit: number, total: number } }

// Error
{ error: string, code?: string }
```

---

> **Rule:** Complete Phase 1 fully (server boots, auth works end-to-end, tests pass) before starting Phase 2. Each phase builds on the previous.

*Built by DES students, for DES students. 🔥*
