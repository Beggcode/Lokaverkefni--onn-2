import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleError } from "../../../shared/lib/handleError";
import { useToast } from "../../../shared/hooks/useToast";
import { getCart, removeFromCart, updateCartItem } from "../services/cart";

export function useCart() {
	const queryClient = useQueryClient();
	const showToast = useToast();

	const query = useQuery({ queryKey: ["cart"], queryFn: getCart });

	const remove = useMutation({
		mutationFn: removeFromCart,
		onSuccess: (updated) => {
			queryClient.setQueryData(["cart"], updated);
			showToast("Item removed", "success");
		},
		onError: (err: Error) => handleError(err, showToast),
	});

	const update = useMutation({
		mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
			updateCartItem(itemId, quantity),
		onSuccess: (updated) => queryClient.setQueryData(["cart"], updated),
		onError: (err: Error) => handleError(err, showToast),
	});

	return { ...query, remove, update };
}
