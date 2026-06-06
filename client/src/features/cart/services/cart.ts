import { cartResponseSchema } from "@ntv/shared";
import { apiFetchJson } from "../../../shared/lib/apiFetch";

export async function getCart() {
	const data = await apiFetchJson(cartResponseSchema, "/api/cart");
	return data.cart;
}

export async function addToCart(variantId: number, quantity: number) {
	const data = await apiFetchJson(cartResponseSchema, "/api/cart/items", {
		method: "POST",
		json: { variantId, quantity },
	});
	return data.cart;
}

export async function removeFromCart(itemId: number) {
	const data = await apiFetchJson(
		cartResponseSchema,
		`/api/cart/items/${itemId}`,
		{ method: "DELETE" },
	);
	return data.cart;
}

export async function updateCartItem(itemId: number, quantity: number) {
	const data = await apiFetchJson(
		cartResponseSchema,
		`/api/cart/items/${itemId}`,
		{ method: "PATCH", json: { quantity } },
	);
	return data.cart;
}
