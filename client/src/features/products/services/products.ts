import {
  productResponseSchema,
  productListResponseSchema,
  type ProductQuery,
} from "@ntv/shared";
import { apiFetchJson } from "../../../shared/lib/apiFetch";

export type { Product } from "@ntv/shared";

export async function getProducts(query: ProductQuery = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.categoryId) params.set("categoryId", String(query.categoryId));
  const qs = params.size ? `?${params}` : "";
  const data = await apiFetchJson(
    productListResponseSchema,
    `/api/products${qs}`,
  );
  return data.products;
}

export async function getProduct(id: number) {
  const data = await apiFetchJson(productResponseSchema, `/api/products/${id}`);
  return data.product;
}
