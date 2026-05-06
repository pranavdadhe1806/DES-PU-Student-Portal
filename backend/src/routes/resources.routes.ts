// TODO: Resources routes (Study Materials + My Space)
// GET    /resources/:subjectId         → List subject resources
// POST   /resources/:subjectId/upload  → Upload resource → triggers BullMQ file processing
// GET    /resources/:id/presigned-url  → Get Cloudflare R2 presigned download URL
// DELETE /resources/:id               → Delete resource (owner/admin)
// GET    /resources/my-space          → List user's personal cloud files

import { Router } from 'express';

const router = Router();

// TODO: Mount resource controllers here

export default router;
