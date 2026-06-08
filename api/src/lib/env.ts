import { z } from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string().min(1),
	DATABASE_URL: z.string().min(1),
	PORT: z.coerce.number().default(3000),
	CLIENT_URL: z.string().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
