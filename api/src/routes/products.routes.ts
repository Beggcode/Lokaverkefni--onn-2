import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
  });
  res.json({ products });
});

export default router;
