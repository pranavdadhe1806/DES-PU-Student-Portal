// TODO: JWT auth middleware
// - Read JWT from HTTP-only cookie
// - Verify token signature with JWT_SECRET
// - Attach decoded user payload to req.user
// - Return 401 if missing or invalid

import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // TODO: implement
  next();
};
