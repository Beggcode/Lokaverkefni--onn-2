import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(_req: AuthRequest, _res: Response, next: NextFunction) {
  next();
}
