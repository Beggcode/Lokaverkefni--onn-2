import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SIZES = ["S", "M", "L"];

function variants(stock = 10) {
	return SIZES.map((size) => ({ size, stock }));
}

async function main() {
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.cartItem.deleteMany();
	await prisma.cart.deleteMany();
	await prisma.productVariant.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();

	const [jackets, fleece, baseLayers, pants, accessories, shirts, swimwear] =
		await Promise.all([
			prisma.category.create({ data: { name: "Jackets" } }),
			prisma.category.create({ data: { name: "Fleece" } }),
			prisma.category.create({ data: { name: "Base Layers" } }),
			prisma.category.create({ data: { name: "Pants" } }),
			prisma.category.create({ data: { name: "Accessories" } }),
			prisma.category.create({ data: { name: "Shirts" } }),
			prisma.category.create({ data: { name: "Swimwear" } }),
		]);

	await Promise.all([
		prisma.product.create({
			data: {
				name: "Heidi",
				description:
					"We sent the fabric to a small village in the Swiss Alps where a woman named Heidi, who has never once been cold, wove it by hand under a full moon. When you put it on, something shifts. People around you will feel it before they see it. Your cortisol drops. Your posture corrects itself. This is not a jacket. This is a recalibration.",
				price: 55000,
				imageUrl:
					"https://images.unsplash.com/photo-1557418669-db3f781a58c0?q=80&w=997&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				season: "ALL_SEASON",
				categoryId: jackets.id,
				variants: { create: variants() },
			},
		}),
		prisma.product.create({
			data: {
				name: "Björn",
				description:
					"Sourced from a lineage of merino sheep that graze exclusively on a south-facing Icelandic hillside, listened to classical music, and have never experienced stress. The warmth you feel is not thermal — it is ancestral. Customers report vivid dreams, a newfound intolerance for mediocrity, and an inexplicable urge to quit their jobs and move somewhere with better air.",
				price: 25000,
				imageUrl:
					"https://images.unsplash.com/photo-1716394189244-08e7cf6ca31d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZsZWVjZXxlbnwwfHwwfHx8MA%3D%3D",
				season: "AUTUMN",
				categoryId: fleece.id,
				variants: { create: variants() },
			},
		}),
		prisma.product.create({
			data: {
				name: "Lieselotte",
				description:
					"Before we could name this garment, we had to understand it. It took three years. What lives against your skin matters more than what the world sees — this is something most people will never grasp, and that is okay, because this was not made for most people. A base layer for those who understand that true luxury begins in the invisible layer.",
				price: 20000,
				imageUrl:
					"https://images.unsplash.com/photo-1585983549454-41992b5abe5a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
				season: "WINTER",
				categoryId: baseLayers.id,
				variants: { create: variants() },
			},
		}),
		prisma.product.create({
			data: {
				name: "Gunther",
				description:
					"Our lead designer spent four months in silent retreat before touching the pattern for these pants. What emerged was not a design decision but a channeling. The cut follows the natural energy meridians of the human body, which is why movement feels effortless and strangers hold doors open for you without knowing why. You will walk differently. You already know this.",
				price: 30000,
				imageUrl:
					"https://images.unsplash.com/photo-1762343946845-b92d789aac42?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBhbnRzJTIwc3VtbWVyfGVufDB8fDB8fHww",
				season: "SUMMER",
				categoryId: pants.id,
				variants: { create: variants() },
			},
		}),
		prisma.product.create({
			data: {
				name: "Søren",
				description:
					"There are shirts, and then there is Søren. Woven from fibers that have been ethically sourced, astrologically timed, and pressed exactly once by a man in Copenhagen who has never rushed anything in his life. Wear it in spring. Feel the season respond.",
				price: 18000,
				imageUrl:
					"https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHQlMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D",
				season: "SPRING",
				categoryId: shirts.id,
				variants: { create: variants() },
			},
		}),
		prisma.product.create({
			data: {
				name: "Valentina",
				description:
					"Designed for the water, but mostly for the moment just before you enter it — when everyone on the beach turns to look and isn't entirely sure why. Cut from a fabric developed in collaboration with a marine biologist who also paints. The ocean will know.",
				price: 22000,
				imageUrl:
					"https://images.unsplash.com/photo-1561504599-f900052636b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3dpbXdlYXIlMjBtZW58ZW58MHx8MHx8fDA%3D",
				season: "SUMMER",
				categoryId: swimwear.id,
				variants: { create: variants() },
			},
		}),
		prisma.product.create({
			data: {
				name: "Klaus",
				description:
					"A vessel for your belongings, yes. But also a vessel for your intentions. Klaus was designed by tracing the silhouette of a man who had just returned from somewhere extraordinary and refused to talk about it. Carry it and people will assume the same of you.",
				price: 45000,
				imageUrl:
					"https://images.unsplash.com/photo-1621624959365-071359461b94?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja3BhY2slMjB1Z2x5fGVufDB8fDB8fHww",
				type: "Backpack",
				season: "ALL_SEASON",
				categoryId: accessories.id,
				variants: { create: [{ size: null, stock: 30 }] },
			},
		}),
		prisma.product.create({
			data: {
				name: "Solveig",
				description:
					"Italian acetate. Austrian crystal hinges. Lenses that filter not just UV but a certain kind of spiritual noise that accumulates in bright places. Solveig does not make you look cool. Solveig reveals that you already were.",
				price: 35000,
				imageUrl:
					"https://images.unsplash.com/photo-1721622560183-4172c8ef8934?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnVubnklMjBzdW5nbGFzc2VzfGVufDB8fDB8fHww",
				type: "Sunglasses",
				season: "SUMMER",
				categoryId: accessories.id,
				variants: { create: [{ size: null, stock: 30 }] },
			},
		}),
		prisma.product.create({
			data: {
				name: "Astrid",
				description:
					"Handcrafted by artisans in a coastal Norwegian town that does not appear on most maps. The yarn carries a frequency. We know how that sounds. We also know that every person who has worn this beanie has reported feeling, for the first time, completely and utterly at home in their own skull. Crown your consciousness accordingly.",
				price: 6000,
				imageUrl:
					"https://images.unsplash.com/photo-1648483092137-6e63796c8b06?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhbmllfGVufDB8fDB8fHww",
				type: "Beanie",
				season: "WINTER",
				categoryId: accessories.id,
				variants: { create: [{ size: null, stock: 30 }] },
			},
		}),
	]);

	console.log("products seeded");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
