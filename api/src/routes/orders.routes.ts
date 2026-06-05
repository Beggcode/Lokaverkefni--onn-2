import { Router, type IRouter } from "express";
import { parseId } from "../lib/parse.js";
import {
	cartCheckoutInclude,
	cartItemsInclude,
} from "../lib/prisma-includes.js";
import { prisma } from "../lib/prisma.js";
import {
	authenticate,
	type AuthRequest,
} from "../middleware/auth.middleware.js";

const router: IRouter = Router();

router.use(authenticate);

router.post("/", async (req: AuthRequest, res) => {
	const cart = await prisma.cart.findUnique({
		where: { userId: req.userId },
		include: cartCheckoutInclude,
	});

	if (!cart || cart.items.length === 0) {
		res.status(400).json({ error: "Cart is empty" });
		return;
	}

	let total = 0;
	for (const item of cart.items) {
		total += item.variant.product.price * item.quantity;
	}

	const order = await prisma.$transaction(async (tx) => {
		const created = await tx.order.create({
			data: {
				userId: req.userId!,
				total,
				items: {
					create: cart.items.map((item) => ({
						variantId: item.variantId,
						quantity: item.quantity,
						price: item.variant.product.price,
					})),
				},
			},
			include: cartItemsInclude,
		});
		await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
		return created;
	});

	res.status(201).json({ order });
});

router.get("/", async (req: AuthRequest, res) => {
	const orders = await prisma.order.findMany({
		where: { userId: req.userId },
		orderBy: { createdAt: "desc" },
		include: cartItemsInclude,
	});
	res.json({ orders });
});

router.get("/:id", async (req: AuthRequest, res) => {
	const id = parseId(req.params.id, res);
	if (id === null) return;

	const order = await prisma.order.findFirst({
		where: { id, userId: req.userId },
		include: cartItemsInclude,
	});

	if (!order) {
		res.status(404).json({ error: "Order not found" });
		return;
	}

	res.json({ order });
});

export default router;
