import type { Response } from "express";
import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export function parseBody<T>(
	schema: z.ZodType<T>,
	body: unknown,
	res: Response,
): T | null {
	const result = schema.safeParse(body);
	if (!result.success) {
		res
			.status(400)
			.json({ error: result.error.issues.map((i) => i.message).join(", ") });
		return null;
	}
	return result.data;
}

export function parseId(param: unknown, res: Response): number | null {
	const result = idSchema.safeParse(param);
	if (!result.success) {
		res.status(400).json({ error: "Invalid id" });
		return null;
	}
	return result.data;
}
