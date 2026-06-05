import { addToCartSchema, updateCartItemSchema } from "@ntv/shared";
import type { Response } from "express";
import { Router, type IRouter } from "express";
import { parseBody, parseId } from "../lib/parse.js";
import { cartItemsInclude } from "../lib/prisma-includes.js";
import { prisma } from "../lib/prisma.js";
import {
	authenticate,
	type AuthRequest,
} from "../middleware/auth.middleware.js";

async function respondWithCart(cartId: number, res: Response) {
	const cart = await prisma.cart.findUnique({
		where: { id: cartId },
		include: cartItemsInclude,
	});
	res.json({ cart });
}

async function findCartAndItem(
	userId: number | undefined,
	itemId: number,
	res: Response,
) {
	const cart = await prisma.cart.findUnique({ where: { userId } });
	if (!cart) {
		res.status(404).json({ error: "Cart not found" });
		return null;
	}
	const item = await prisma.cartItem.findFirst({
		where: { id: itemId, cartId: cart.id },
	});
	if (!item) {
		res.status(404).json({ error: "Item not found in cart" });
		return null;
	}
	return { cart, item };
}

const router: IRouter = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
	const cart = await prisma.cart.upsert({
		where: { userId: req.userId! },
		create: { userId: req.userId! },
		update: {},
		include: cartItemsInclude,
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

	await respondWithCart(cart.id, res);
});

router.patch("/items/:itemId", async (req: AuthRequest, res) => {
	const itemId = parseId(req.params.itemId, res);
	if (itemId === null) return;

	const body = parseBody(updateCartItemSchema, req.body, res);
	if (!body) return;

	const found = await findCartAndItem(req.userId, itemId, res);
	if (!found) return;
	const { cart } = found;

	await prisma.cartItem.update({
		where: { id: itemId },
		data: { quantity: body.quantity },
	});

	await respondWithCart(cart.id, res);
});

router.delete("/items/:itemId", async (req: AuthRequest, res) => {
	const itemId = parseId(req.params.itemId, res);
	if (itemId === null) return;

	const found = await findCartAndItem(req.userId, itemId, res);
	if (!found) return;
	const { cart } = found;

	await prisma.cartItem.delete({ where: { id: itemId } });

	await respondWithCart(cart.id, res);
});

export default router;
