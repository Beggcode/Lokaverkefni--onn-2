import { loginSchema, registerSchema } from "@ntv/shared";
import bcrypt from "bcryptjs";
import { Router, type IRouter, type Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env.js";
import { parseBody } from "../lib/parse.js";
import { prisma } from "../lib/prisma.js";
import {
	authenticate,
	type AuthRequest,
} from "../middleware/auth.middleware.js";

const router: IRouter = Router();

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function setAuthCookie(res: Response, userId: number) {
	const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
	res.cookie("token", token, {
		httpOnly: true,
		sameSite: "lax",
		maxAge: SEVEN_DAYS_MS,
	});
}

router.post("/register", async (req, res) => {
	const body = parseBody(registerSchema, req.body, res);
	if (!body) return;
	const hashed = await bcrypt.hash(body.password, 12);
	const user = await prisma.user.create({
		data: { email: body.email, password: hashed, name: body.name },
		select: { id: true, email: true, name: true },
	});
	setAuthCookie(res, user.id);
	res.status(201).json({ user });
});

router.post("/login", async (req, res) => {
	const body = parseBody(loginSchema, req.body, res);
	if (!body) return;
	const user = await prisma.user.findUnique({ where: { email: body.email } });
	if (!user || !(await bcrypt.compare(body.password, user.password))) {
		res.status(401).json({ error: "Invalid credentials" });
		return;
	}
	setAuthCookie(res, user.id);
	res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

router.post("/logout", (_req, res) => {
	res.clearCookie("token");
	res.json({ message: "ok" });
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
	const user = await prisma.user.findUnique({
		where: { id: req.userId },
		select: { id: true, email: true, name: true },
	});
	res.json({ user });
});

export default router;
