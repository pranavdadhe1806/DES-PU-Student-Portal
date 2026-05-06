// TODO: Forum routes
// GET    /forums/:subjectId/posts   → List posts in subject forum (paginated)
// POST   /forums/:subjectId/posts   → Create a new post
// GET    /forums/posts/:postId      → Get single post with replies
// POST   /forums/posts/:postId/reply → Reply to a post (nested)
// PATCH  /forums/posts/:postId/upvote → Toggle upvote
// PATCH  /forums/posts/:postId/pin    → Pin post (faculty/admin only)
// DELETE /forums/posts/:postId      → Delete post (author/admin)

import { Router } from 'express';

const router = Router();

// TODO: Mount forum controllers here

export default router;
