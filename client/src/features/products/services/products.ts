import { productResponseSchema, productListResponseSchema } from "@ntv/shared";
import { apiFetchJson } from "../../../shared/lib/apiFetch";

export type { Product } from "@ntv/shared";

export async function getProducts() {
  const data = await apiFetchJson(productListResponseSchema, "/api/products");
  return data.products;
}

export async function getProduct(id: number) {
  const data = await apiFetchJson(productResponseSchema, `/api/products/${id}`);
  return data.product;
}
