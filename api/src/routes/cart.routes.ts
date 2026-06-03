import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";
import {
	authenticate,
	type AuthRequest,
} from "../middleware/auth.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "@ntv/shared";
import { parseBody, parseId } from "../lib/parse.js";

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

router.get("/", async (req: AuthRequest, res) => {
	const cart = await prisma.cart.upsert({
		where: { userId: req.userId! },
		create: { userId: req.userId! },
		update: {},
		include: cartInclude,
	});
	res.json({ cart });
});

router.post("/items", async (req: AuthRequest, res) => {
	const body = parseBody(addToCartSchema, req.body, res);
	if (!body) return;
	const { variantId, quantity } = body;

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

	const cart = await prisma.cart.upsert({
		where: { userId: req.userId! },
		create: { userId: req.userId! },
		update: {},
	});

	const existing = await prisma.cartItem.findFirst({
		where: { cartId: cart.id, variantId },
	});

	const newTotal = (existing?.quantity ?? 0) + quantity;
	if (newTotal > variant.stock) {
		res.status(400).json({ error: "Not enough stock" });
		return;
	}

	if (existing) {
		await prisma.cartItem.update({
			where: { id: existing.id },
			data: { quantity: newTotal },
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

router.patch("/items/:itemId", async (req: AuthRequest, res) => {
	const itemId = parseId(req.params.itemId, res);
	if (itemId === null) return;

	const body = parseBody(updateCartItemSchema, req.body, res);
	if (!body) return;

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
		data: { quantity: body.quantity },
	});

	const updated = await prisma.cart.findUnique({
		where: { id: cart.id },
		include: cartInclude,
	});
	res.json({ cart: updated });
});

router.delete("/items/:itemId", async (req: AuthRequest, res) => {
	const itemId = parseId(req.params.itemId, res);
	if (itemId === null) return;

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
