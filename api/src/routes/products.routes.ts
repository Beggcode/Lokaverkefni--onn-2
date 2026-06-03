import { Router, type IRouter } from "express";
import { z } from "zod";
import { parseId } from "../lib/parse.js";
import { prisma } from "../lib/prisma.js";

const productInclude = { category: true, variants: true } as const;

const querySchema = z.object({
	search: z.string().optional(),
	categoryId: z.coerce.number().optional(),
	season: z.string().optional(),
	limit: z.coerce.number().optional(),
});

const router: IRouter = Router();

router.get("/", async (req, res) => {
	const { search, categoryId, season, limit } = querySchema.parse(req.query);
	const products = await prisma.product.findMany({
		where: {
			...(search && { name: { contains: search, mode: "insensitive" } }),
			...(categoryId && { categoryId }),
			...(season && { season: season as any }),
		},
		orderBy: { createdAt: "desc" },
		...(limit && { take: limit }),
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
