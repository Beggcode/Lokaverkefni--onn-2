import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { parseId } from "../lib/parse.js";

const productInclude = { category: true, variants: true } as const;

const querySchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().optional(),
});

const router: IRouter = Router();

router.get("/", async (req, res) => {
  const { search, categoryId } = querySchema.parse(req.query);
  const products = await prisma.product.findMany({
    where: {
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(categoryId && { categoryId }),
    },
    include: productInclude,
  });
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
