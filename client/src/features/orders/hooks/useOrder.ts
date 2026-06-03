import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../services/orders";

export function useOrder(orderId: number) {
	return useQuery({
		queryKey: ["order", orderId],
		queryFn: () => getOrder(orderId),
	});
}
