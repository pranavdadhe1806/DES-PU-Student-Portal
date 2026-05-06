// TODO: Admin routes (admin/faculty only — guarded by RBAC middleware)
// GET    /admin/reports          → Content moderation queue
// PATCH  /admin/users/:id/ban    → Ban a user
// PATCH  /admin/users/:id/role   → Change user role
// GET    /admin/audit-logs       → Platform audit log

import { Router } from 'express';

const router = Router();

// TODO: Mount admin controllers here

export default router;
