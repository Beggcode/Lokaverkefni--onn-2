import {
	productListResponseSchema,
	productResponseSchema,
	type ProductQuery,
} from "@ntv/shared";
import { apiFetchJson } from "../../../shared/lib/apiFetch";

export type { Product } from "@ntv/shared";

export async function getProducts(query: ProductQuery = {}) {
	const filters: Record<string, string> = {};
	if (query.search) filters.search = query.search;
	if (query.categoryId) filters.categoryId = String(query.categoryId);
	if (query.season) filters.season = query.season;
	if (query.limit) filters.limit = String(query.limit);

	const queryString = new URLSearchParams(filters).toString();
	const url = queryString ? `/api/products?${queryString}` : "/api/products";

	const data = await apiFetchJson(productListResponseSchema, url);
	return data.products;
}

export async function getProduct(id: number) {
	const data = await apiFetchJson(productResponseSchema, `/api/products/${id}`);
	return data.product;
}
