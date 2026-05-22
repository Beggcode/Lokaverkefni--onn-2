import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.middleware.js";
import { addToCartSchema } from "@ntv/shared";

const router: IRouter = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  let cart = await prisma.cart.findUnique({
    where: { userId: req.userId },
    include: { items: { include: { variant: { include: { product: { include: { category: true, variants: true } } } } } } },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.userId! },
      include: { items: { include: { variant: { include: { product: { include: { category: true, variants: true } } } } } } },
    });
  }

  res.json({ cart });
});

router.post("/items", async (req: AuthRequest, res) => {
  const result = addToCartSchema.safeParse(req.body);
  if (!result.success) { res.status(400).json({ error: result.error.issues.map(i => i.message).join(', ') }); return; }
  const { variantId, quantity } = result.data;

  let cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.userId! } });
  }

  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, variantId } });
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, variantId, quantity } });
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: { include: { product: { include: { category: true, variants: true } } } } } } },
  });

  res.json({ cart: updated });
});

export default router;
