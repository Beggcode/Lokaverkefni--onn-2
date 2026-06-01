import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtPayloadSchema } from "@ntv/shared";
import { env } from "../lib/env.js";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = jwtPayloadSchema.parse(jwt.verify(token, env.JWT_SECRET));
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
