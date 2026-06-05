import { z } from "zod";
import { variantSchema, productSchema } from "./products";

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
});

export const updateCartItemSchema = z.object({
	quantity: z.number().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type AddToCart = z.infer<typeof addToCartSchema>;

export const cartResponseSchema = z.object({ cart: cartSchema });
