// TODO: Chat routes (REST — real-time handled via Socket.io)
// GET /chat/conversations          → List user's conversations
// GET /chat/conversations/:id      → Get conversation + message history
// POST /chat/conversations         → Start a new 1-to-1 conversation
// GET /chat/groups                 → List user's group chats

import { Router } from 'express';

const router = Router();

// TODO: Mount chat controllers here

export default router;
