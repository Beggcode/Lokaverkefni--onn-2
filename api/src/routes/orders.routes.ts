import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  type AuthRequest,
} from "../middleware/auth.middleware.js";
import { parseId } from "../lib/parse.js";

const router: IRouter = Router();

router.use(authenticate);

const orderInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: { include: { category: true, variants: true } },
        },
      },
    },
  },
};

router.post("/", async (req: AuthRequest, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.userId },
    include: {
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  if (!cart || cart.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.variant.product.price * item.quantity,
    0,
  );

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
      include: orderInclude,
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
    include: orderInclude,
  });
  res.json({ orders });
});

router.get("/:id", async (req: AuthRequest, res) => {
  const id = parseId(req.params.id, res);
  if (id === null) return;

  const order = await prisma.order.findFirst({
    where: { id, userId: req.userId },
    include: orderInclude,
  });

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json({ order });
});

export default router;
