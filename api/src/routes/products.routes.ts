import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const idSchema = z.coerce.number().int().positive();

const productInclude = { category: true, variants: true } as const;

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: productInclude,
  });
  res.json({ products });
});

router.get("/:id", async (req, res) => {
  const result = idSchema.safeParse(req.params.id);
  if (!result.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  const id = result.data;
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ product });
});

export default router;
