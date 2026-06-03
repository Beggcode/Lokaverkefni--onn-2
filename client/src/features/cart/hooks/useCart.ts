import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, removeFromCart, updateCartItem } from "../services/cart";

export function useCart() {
	const queryClient = useQueryClient();

	const query = useQuery({ queryKey: ["cart"], queryFn: getCart });

	const remove = useMutation({
		mutationFn: removeFromCart,
		onSuccess: (updated) => queryClient.setQueryData(["cart"], updated),
	});

	const update = useMutation({
		mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
			updateCartItem(itemId, quantity),
		onSuccess: (updated) => queryClient.setQueryData(["cart"], updated),
	});

	return { ...query, remove, update };
}
