import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/products";

export function useProduct(productId: number) {
	return useQuery({
		queryKey: ["product", productId],
		queryFn: () => getProduct(productId),
	});
}
