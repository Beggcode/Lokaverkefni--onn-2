import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
  });
  res.json({ products });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ product });
});

export default router;
