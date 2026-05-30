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

export const cartItemSchema = z.object({
  id: z.number(),
  variantId: z.number(),
  quantity: z.number(),
  variant: variantSchema.extend({ product: productSchema }),
});

export const cartSchema = z.object({
  id: z.number(),
  items: z.array(cartItemSchema),
});

export const addToCartSchema = z.object({
  variantId: z.number(),
  quantity: z.number().min(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type AddToCart = z.infer<typeof addToCartSchema>;

export const orderStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

export const orderItemSchema = z.object({
  id: z.number(),
  variantId: z.number(),
  quantity: z.number(),
  price: z.number(),
  variant: variantSchema.extend({ product: productSchema }),
});

export const orderSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
  total: z.number(),
  createdAt: z.string(),
  items: z.array(orderItemSchema),
});

export const orderListSchema = z.array(orderSchema);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
