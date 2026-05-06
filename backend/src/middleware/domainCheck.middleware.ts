// TODO: DES domain restriction middleware
// - On registration, verify email ends with @despuniversity.edu.in
// - Return 403 with clear error message if domain doesn't match
// - Applied only to /auth/register route

import { Request, Response, NextFunction } from 'express';

export const domainCheck = (req: Request, res: Response, next: NextFunction): void => {
  // TODO: implement DES email domain check
  next();
};
