import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";
import {
	authenticate,
	type AuthRequest,
} from "../middleware/auth.middleware.js";
import { z } from "zod";
import { addToCartSchema, updateCartItemSchema } from "@ntv/shared";

const idSchema = z.coerce.number().int().positive();

const cartInclude = {
	items: {
		include: {
			variant: {
				include: {
					product: { include: { category: true, variants: true } },
				},
			},
		},
	},
} as const;

const router: IRouter = Router();

router.use(authenticate);

// GET /api/cart *_* return the user's cart, creating one if it doesn't exist yet
router.get("/", async (req: AuthRequest, res) => {
	let cart = await prisma.cart.findUnique({
		where: { userId: req.userId },
		include: cartInclude,
	});

	if (!cart) {
		cart = await prisma.cart.create({
			data: { userId: req.userId! },
			include: {
				items: {
					include: {
						variant: {
							include: {
								product: { include: { category: true, variants: true } },
							},
						},
					},
				},
			},
		});
	}

	res.json({ cart });
});

// POST /api/cart/items *_* add a variant to the cart, or increase quantity if it is already there
router.post("/items", async (req: AuthRequest, res) => {
	const result = addToCartSchema.safeParse(req.body);
	if (!result.success) {
		res
			.status(400)
			.json({ error: result.error.issues.map((i) => i.message).join(", ") });
		return;
	}
	const { variantId, quantity } = result.data;

	// make sure the item exists and has enough stock
	const variant = await prisma.productVariant.findUnique({
		where: { id: variantId },
	});
	if (!variant) {
		res.status(404).json({ error: "Variant not found" });
		return;
	}
	if (variant.stock < quantity) {
		res.status(400).json({ error: "Not enough stock" });
		return;
	}

	let cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
	if (!cart) {
		cart = await prisma.cart.create({ data: { userId: req.userId! } });
	}

	// if item already in cart, increase quantity. Otherwise create a new item
	const existing = await prisma.cartItem.findFirst({
		where: { cartId: cart.id, variantId },
	});
	if (existing) {
		await prisma.cartItem.update({
			where: { id: existing.id },
			data: { quantity: existing.quantity + quantity },
		});
	} else {
		await prisma.cartItem.create({
			data: { cartId: cart.id, variantId, quantity },
		});
	}

	const updated = await prisma.cart.findUnique({
		where: { id: cart.id },
		include: cartInclude,
	});

	res.json({ cart: updated });
});

// PATCH /api/cart/items/:itemId *_* update quantity of an item in the cart
router.patch("/items/:itemId", async (req: AuthRequest, res) => {
	const idResult = idSchema.safeParse(req.params.itemId);
	if (!idResult.success) {
		res.status(400).json({ error: "Invalid item id" });
		return;
	}
	const itemId = idResult.data;

	const result = updateCartItemSchema.safeParse(req.body);
	if (!result.success) {
		res.status(400).json({ error: result.error.issues.map((i) => i.message).join(", ") });
		return;
	}

	const cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
	if (!cart) {
		res.status(404).json({ error: "Cart not found" });
		return;
	}

	const item = await prisma.cartItem.findFirst({
		where: { id: itemId, cartId: cart.id },
	});
	if (!item) {
		res.status(404).json({ error: "Item not found in cart" });
		return;
	}

	await prisma.cartItem.update({
		where: { id: itemId },
		data: { quantity: result.data.quantity },
	});

	const updated = await prisma.cart.findUnique({
		where: { id: cart.id },
		include: cartInclude,
	});

	res.json({ cart: updated });
});

// DELETE /api/cart/items/:itemId *_* remove an item from the user's cart
router.delete("/items/:itemId", async (req: AuthRequest, res) => {
	const idResult = idSchema.safeParse(req.params.itemId);
	if (!idResult.success) {
		res.status(400).json({ error: "Invalid item id" });
		return;
	}
	const itemId = idResult.data;

	const cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
	if (!cart) {
		res.status(404).json({ error: "Cart not found" });
		return;
	}

	const item = await prisma.cartItem.findFirst({
		where: { id: itemId, cartId: cart.id },
	});
	if (!item) {
		res.status(404).json({ error: "Item not found in cart" });
		return;
	}

	await prisma.cartItem.delete({ where: { id: itemId } });

	const updated = await prisma.cart.findUnique({
		where: { id: cart.id },
		include: cartInclude,
	});

	res.json({ cart: updated });
});

export default router;
