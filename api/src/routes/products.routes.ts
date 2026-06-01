import { Router, type IRouter } from "express";
import { prisma } from "../lib/prisma.js";
import { parseId } from "../lib/parse.js";

const productInclude = { category: true, variants: true } as const;

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({ include: productInclude });
  res.json({ products });
});

router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id, res);
  if (id === null) return;
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
