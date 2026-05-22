import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.middleware.js";

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

export default router;
