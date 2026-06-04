import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../ui/store/toastStore";
import { getCart, removeFromCart, updateCartItem } from "../services/cart";

export function useCart() {
	const queryClient = useQueryClient();
	const showToast = useToastStore((s) => s.showToast);

	const query = useQuery({ queryKey: ["cart"], queryFn: getCart });

	const remove = useMutation({
		mutationFn: removeFromCart,
		onSuccess: (updated) => {
			queryClient.setQueryData(["cart"], updated);
			showToast("Item removed", "success");
		},
		onError: (err: Error) => showToast(err.message, "error"),
	});

	const update = useMutation({
		mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
			updateCartItem(itemId, quantity),
		onSuccess: (updated) => queryClient.setQueryData(["cart"], updated),
		onError: (err: Error) => showToast(err.message, "error"),
	});

	return { ...query, remove, update };
}
