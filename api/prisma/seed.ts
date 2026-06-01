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

	const [jackets, fleece, baseLayers, pants, accessories] = await Promise.all([
		prisma.category.create({ data: { name: "Jackets" } }),
		prisma.category.create({ data: { name: "Fleece" } }),
		prisma.category.create({ data: { name: "Base Layers" } }),
		prisma.category.create({ data: { name: "Pants" } }),
		prisma.category.create({ data: { name: "Accessories" } }),
	]);

	await Promise.all([
		prisma.product.create({
			data: {
				name: "Jacket",
				description: null,
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
				name: "Fleece",
				description: null,
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
				name: "Base Layer Top",
				description: null,
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
				name: "Pants",
				description: null,
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
				name: "Beanie",
				description: null,
				price: 6000,
				imageUrl:
					"https://images.unsplash.com/photo-1648483092137-6e63796c8b06?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhbmllfGVufDB8fDB8fHww",
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
