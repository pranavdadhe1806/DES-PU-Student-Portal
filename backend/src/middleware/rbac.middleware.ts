// TODO: Role-Based Access Control middleware
// - Check req.user.role against allowed roles
// - Return 403 Forbidden if role is insufficient
// - Usage: rbac(['admin', 'faculty'])

import { Request, Response, NextFunction } from 'express';

export const rbac = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // TODO: implement role check
    next();
  };
};
