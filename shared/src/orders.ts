import { z } from "zod";
import { productSchema, variantSchema } from "./products";

export const orderStatusSchema = z.enum([
	"PENDING",
	"CONFIRMED",
	"SHIPPED",
	"DELIVERED",
	"CANCELLED",
]);

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

export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;

export const orderResponseSchema = z.object({ order: orderSchema });
export const orderListResponseSchema = z.object({ orders: orderListSchema });
