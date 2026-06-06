import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../shared/hooks/useToast";
import { addToCart } from "../services/cart";

export function useAddToCart() {
	const queryClient = useQueryClient();
	const showToast = useToast();

	return useMutation({
		mutationFn: ({
			variantId,
			quantity,
		}: {
			variantId: number;
			quantity: number;
		}) => addToCart(variantId, quantity),
		onSuccess: (updated) => {
			queryClient.setQueryData(["cart"], updated);
			showToast("Added to cart!", "success");
		},
		onError: (err: Error) => showToast(err.message, "error"),
	});
}
