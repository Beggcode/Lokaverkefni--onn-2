import type { Category, Product } from "@ntv/shared";

export function uniqueCategories(products: Product[]): Category[] {
	return [
		...new Map(products.map((p) => [p.category.id, p.category])).values(),
	];
}
