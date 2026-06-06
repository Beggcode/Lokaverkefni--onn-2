import { orderResponseSchema } from "@ntv/shared";
import { apiFetchJson } from "../../../shared/lib/apiFetch";

export async function checkout() {
	const data = await apiFetchJson(orderResponseSchema, "/api/orders", {
		method: "POST",
	});
	return data.order;
}

export async function getOrder(id: number) {
	const data = await apiFetchJson(orderResponseSchema, `/api/orders/${id}`);
	return data.order;
}
