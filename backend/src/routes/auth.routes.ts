// TODO: Auth routes
// POST /auth/register  → Register with DES email + Argon2 password hash
// POST /auth/login     → Login, issue JWT in HTTP-only cookie
// POST /auth/logout    → Clear auth cookie
// GET  /auth/me        → Return current user from JWT

import { Router } from 'express';

const router = Router();

// TODO: Mount auth controllers here

export default router;
