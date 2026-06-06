import {
	productListResponseSchema,
	productResponseSchema,
	type ProductQuery,
} from "@ntv/shared";
import { apiFetchJson } from "../../../shared/lib/apiFetch";

export type { Product } from "@ntv/shared";

export async function getProducts(query: ProductQuery = {}) {
	const params = new URLSearchParams();
	if (query.search) params.set("search", query.search);
	if (query.categoryId) params.set("categoryId", String(query.categoryId));
	if (query.season) params.set("season", query.season);
	if (query.limit) params.set("limit", String(query.limit));

	const queryString = params.toString();
	const data = await apiFetchJson(
		productListResponseSchema,
		queryString ? `/api/products?${queryString}` : "/api/products",
	);
	return data.products;
}

export async function getProduct(id: number) {
	const data = await apiFetchJson(productResponseSchema, `/api/products/${id}`);
	return data.product;
}
