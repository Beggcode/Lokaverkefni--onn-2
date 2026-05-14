import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashed, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ user });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "logged out" });
});

router.post("/login", (_req, res) => {
  res.json({ message: "ok" });
});

export default router;
