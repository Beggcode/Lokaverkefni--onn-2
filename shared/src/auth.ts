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
	name: z.string().min(1, "Name is required"),
	email: z.email("Please enter a valid email"),
	password: z
		.string()
		.min(15, "Password must be at least 15 characters")
		.max(64, "Password must be under 64 characters"),
});

export const userResponseSchema = z.object({ user: userSchema });
