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
	password: z.string().min(6),
});

export const seasonSchema = z.enum(['SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_SEASON']);

export const variantSchema = z.object({
	id: z.number(),
	size: z.string().nullable(),
	color: z.string().nullable(),
	stock: z.number(),
});

export const categorySchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const productSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.number(),
	imageUrl: z.string().nullable(),
	season: seasonSchema,
	category: categorySchema,
	variants: z.array(variantSchema),
});

export const productListSchema = z.array(productSchema);

export type Season = z.infer<typeof seasonSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
