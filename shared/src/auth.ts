import { z } from "zod";

export const userSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const jwtPayloadSchema = z.object({
	userId: z.number(),
});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

export const registerSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	password: z.string().min(15).max(64),
});

export const userResponseSchema = z.object({ user: userSchema });
