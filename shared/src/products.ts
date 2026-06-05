import { z } from "zod";

export const seasonSchema = z.enum([
	"SPRING",
	"SUMMER",
	"AUTUMN",
	"WINTER",
	"ALL_SEASON",
]);

export const variantSchema = z.object({
	id: z.number(),
	size: z.string().nullable(),
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

export const productQuerySchema = z.object({
	search: z.string().optional(),
	categoryId: z.number().optional(),
	season: seasonSchema.optional(),
	limit: z.number().optional(),
});

export type Season = z.infer<typeof seasonSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;

export const productResponseSchema = z.object({ product: productSchema });
export const productListResponseSchema = z.object({
	products: productListSchema,
});
